import { cacheManager } from './performance'

export interface DataProcessorConfig {
  batchSize: number
  maxRetries: number
  retryDelay: number
  enableCaching: boolean
  cacheTTL: number
  enableValidation: boolean
  enableTransform: boolean
  enableEnrichment: boolean
}

export interface PipelineStep<T = any, R = any> {
  name: string
  process: (data: T) => Promise<R>
  validate?: (data: T) => boolean
  transform?: (data: T) => T
  onError?: (error: Error, data: T) => void
}

export interface DataPipelineEvent {
  type: 'start' | 'complete' | 'error' | 'progress'
  step: string
  timestamp: number
  data?: any
  error?: Error
  progress?: number
}

export class DataPipeline {
  private steps: PipelineStep[] = []
  private config: DataProcessorConfig
  private eventListeners: ((event: DataPipelineEvent) => void)[] = []

  constructor(config: Partial<DataProcessorConfig> = {}) {
    this.config = {
      batchSize: 100,
      maxRetries: 3,
      retryDelay: 1000,
      enableCaching: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      enableValidation: true,
      enableTransform: true,
      enableEnrichment: true,
      ...config
    }
  }

  addStep<T, R>(step: PipelineStep<T, R>): this {
    this.steps.push(step)
    return this
  }

  onEvent(listener: (event: DataPipelineEvent) => void): this {
    this.eventListeners.push(listener)
    return this
  }

  private emitEvent(event: DataPipelineEvent): void {
    this.eventListeners.forEach(listener => listener(event))
  }

  async process<T>(inputData: T[]): Promise<any[]> {
    this.emitEvent({
      type: 'start',
      step: 'pipeline',
      timestamp: Date.now(),
      data: { itemCount: inputData.length }
    })

    try {
      let data: any[] = inputData

      for (let i = 0; i < this.steps.length; i++) {
        const step = this.steps[i]
        
        this.emitEvent({
          type: 'start',
          step: step.name,
          timestamp: Date.now()
        })

        // Check cache if enabled
        const cacheKey = this.config.enableCaching 
          ? `pipeline_${step.name}_${JSON.stringify(data.slice(0, 10))}` 
          : null
        
        if (cacheKey) {
          const cachedResult = cacheManager.get(cacheKey)
          if (cachedResult) {
            data = cachedResult
            this.emitEvent({
              type: 'complete',
              step: step.name,
              timestamp: Date.now(),
              data: { fromCache: true }
            })
            continue
          }
        }

        // Process data in batches
        const results: any[] = []
        const totalBatches = Math.ceil(data.length / this.config.batchSize)
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const batch = data.slice(
            batchIndex * this.config.batchSize,
            (batchIndex + 1) * this.config.batchSize
          )

          const batchResults = await this.processBatchWithRetry(batch, step)
          results.push(...batchResults)

          this.emitEvent({
            type: 'progress',
            step: step.name,
            timestamp: Date.now(),
            progress: ((batchIndex + 1) / totalBatches) * 100
          })
        }

        data = results

        // Cache result if enabled
        if (cacheKey) {
          cacheManager.set(cacheKey, data, this.config.cacheTTL)
        }

        this.emitEvent({
          type: 'complete',
          step: step.name,
          timestamp: Date.now(),
          data: { processedItems: data.length }
        })
      }

      this.emitEvent({
        type: 'complete',
        step: 'pipeline',
        timestamp: Date.now(),
        data: { finalItemCount: data.length }
      })

      return data
    } catch (error) {
      this.emitEvent({
        type: 'error',
        step: 'pipeline',
        timestamp: Date.now(),
        error: error as Error
      })
      throw error
    }
  }

  private async processBatchWithRetry<T, R>(
    batch: T[],
    step: PipelineStep<T, R>
  ): Promise<R[]> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Validate data if enabled
        if (this.config.enableValidation && step.validate) {
          const validData = batch.filter(item => step.validate!(item))
          if (validData.length !== batch.length) {
            console.warn(`Step "${step.name}": Filtered out ${batch.length - validData.length} invalid items`)
          }
          batch = validData as T[]
        }

        // Transform data if enabled
        if (this.config.enableTransform && step.transform) {
          batch = batch.map(item => step.transform!(item))
        }

        // Process the batch
        const results = await step.process(batch)
        return results
      } catch (error) {
        lastError = error as Error
        
        if (step.onError) {
          step.onError(error as Error, batch[0]) // Pass first item for context
        }

        if (attempt < this.config.maxRetries) {
          console.warn(`Step "${step.name}" failed (attempt ${attempt}/${this.config.maxRetries}), retrying...`)
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt))
        }
      }
    }

    throw lastError || new Error(`Step "${step.name}" failed after ${this.config.maxRetries} retries`)
  }
}

// Pre-built processors for common data processing tasks

export const DataProcessors = {
  // CSV data processor
  csv: {
    parse: (csvText: string, delimiter = ',') => {
      const lines = csvText.split('\n').filter(line => line.trim())
      if (lines.length === 0) return []

      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''))
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
        const row: any = {}
        
        headers.forEach((header, i) => {
          row[header] = values[i] || ''
        })
        
        row._originalIndex = index + 1
        return row
      })

      return data
    },

    validate: (data: any[]) => {
      return data.filter(row => {
        // Basic validation: ensure row has data
        return Object.values(row).some(value => value && value.toString().trim())
      })
    },

    transform: (data: any[], columnMapping?: Record<string, string>) => {
      if (!columnMapping) return data

      return data.map(row => {
        const transformed: any = {}
        
        Object.entries(columnMapping).forEach(([targetField, sourceField]) => {
          transformed[targetField] = row[sourceField] || ''
        })
        
        return transformed
      })
    }
  },

  // Call data processor
  callData: {
    enrich: (calls: any[], payments: any[]) => {
      return calls.map(call => {
        const enriched = { ...call }
        
        // Find related payments
        const relatedPayments = payments.filter(p => p.clientNumber === call.calleeNumber)
        
        enriched.hasPayment = relatedPayments.length > 0
        enriched.paymentCount = relatedPayments.length
        enriched.totalRevenue = relatedPayments
          .filter(p => p.status === 'SUCCESS')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        
        // Calculate time to first payment
        if (relatedPayments.length > 0) {
          const firstPayment = relatedPayments.sort((a, b) => 
            new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
          )[0]
          
          const callTime = new Date(call.startTime).getTime()
          const paymentTime = new Date(firstPayment.paymentDate).getTime()
          enriched.timeToPayment = Math.round((paymentTime - callTime) / (1000 * 60)) // minutes
        }
        
        return enriched
      })
    },

    aggregate: (calls: any[], groupBy: string = 'callerNumber') => {
      const groups = new Map<string, any[]>()
      
      calls.forEach(call => {
        const key = call[groupBy]
        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key)!.push(call)
      })

      return Array.from(groups.entries()).map(([key, groupCalls]) => {
        const totalCalls = groupCalls.length
        const answeredCalls = groupCalls.filter(c => c.disposition === 'ANSWERED').length
        const totalTalkTime = groupCalls.reduce((sum, c) => sum + (c.talkTime || 0), 0)
        const totalRevenue = groupCalls.reduce((sum, c) => sum + (c.totalRevenue || 0), 0)
        
        return {
          [groupBy]: key,
          totalCalls,
          answeredCalls,
          answerRate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
          averageTalkTime: answeredCalls > 0 ? totalTalkTime / answeredCalls : 0,
          totalRevenue,
          conversionRate: answeredCalls > 0 ? 
            (groupCalls.filter(c => c.hasPayment).length / answeredCalls) * 100 : 0
        }
      })
    }
  },

  // Payment data processor
  paymentData: {
    enrich: (payments: any[], calls: any[]) => {
      return payments.map(payment => {
        const enriched = { ...payment }
        
        // Find related call
        const relatedCall = calls.find(c => c.calleeNumber === payment.clientNumber)
        
        enriched.hasRelatedCall = !!relatedCall
        enriched.callDisposition = relatedCall?.disposition || 'UNKNOWN'
        enriched.callAgent = relatedCall?.callerNumber || 'UNKNOWN'
        
        if (relatedCall) {
          const callTime = new Date(relatedCall.startTime).getTime()
          const paymentTime = new Date(payment.paymentDate).getTime()
          enriched.timeFromCall = Math.round((paymentTime - callTime) / (1000 * 60)) // minutes
        }
        
        return enriched
      })
    },

    aggregate: (payments: any[], groupBy: string = 'paymentMethod') => {
      const groups = new Map<string, any[]>()
      
      payments.forEach(payment => {
        const key = payment[groupBy] || 'UNKNOWN'
        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key)!.push(payment)
      })

      return Array.from(groups.entries()).map(([key, groupPayments]) => {
        const totalPayments = groupPayments.length
        const successfulPayments = groupPayments.filter(p => p.status === 'SUCCESS').length
        const totalAmount = groupPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        const successfulAmount = groupPayments
          .filter(p => p.status === 'SUCCESS')
          .reduce((sum, p) => sum + (p.amount || 0), 0)
        
        return {
          [groupBy]: key,
          totalPayments,
          successfulPayments,
          successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
          totalAmount,
          successfulAmount,
          averageAmount: successfulPayments > 0 ? successfulAmount / successfulPayments : 0
        }
      })
    }
  }
}

// Factory function to create common pipelines
export function createCallCenterPipeline(config?: Partial<DataProcessorConfig>) {
  const pipeline = new DataPipeline(config)

  pipeline
    .addStep({
      name: 'parse_csv',
      process: async (data: string) => {
        return DataProcessors.csv.parse(data)
      }
    })
    .addStep({
      name: 'validate_data',
      process: async (data: any[]) => {
        return DataProcessors.csv.validate(data)
      }
    })
    .addStep({
      name: 'transform_columns',
      process: async (data: any[]) => {
        // This would use the column mapping from the UI
        return data
      }
    })
    .addStep({
      name: 'enrich_call_data',
      process: async (data: any[]) => {
        // This would enrich with payment data if available
        return data
      }
    })

  return pipeline
}