'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'

interface ExportPanelProps {
  callRecords: any[]
  paymentRecords: any[]
  agentStats: any[]
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  includeCallData: boolean
  includePaymentData: boolean
  includeAgentStats: boolean
  dateRange: { from: Date; to: Date } | null
}

export function ExportPanel({ callRecords, paymentRecords, agentStats }: ExportPanelProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCallData: true,
    includePaymentData: true,
    includeAgentStats: true,
    dateRange: null
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      let dataToExport: any[] = []
      let filename = ''
      let mimeType = ''

      // Prepare data based on options
      if (exportOptions.includeAgentStats) {
        const agentStatsData = agentStats.map(stat => ({
          'Agent ID': stat.agentId,
          'Total Calls': stat.totalCalls,
          'Answered Calls': stat.answeredCalls,
          'Failed Calls': stat.failedCalls,
          'No Answer Calls': stat.noAnswerCalls,
          'Answer Rate (%)': stat.answerRate.toFixed(2),
          'Average Talk Time (s)': stat.averageTalkTime.toFixed(2),
          'Calls with Payment': stat.callsWithPayment,
          'Total Revenue': stat.totalRevenue,
          'Conversion Rate (%)': stat.conversionRate.toFixed(2),
          'Average Time to Payment (min)': stat.averageTimeToPayment.toFixed(2)
        }))
        dataToExport = [...dataToExport, ...agentStatsData]
        setExportProgress(33)
      }

      if (exportOptions.includeCallData) {
        const callData = callRecords.map(call => ({
          'Call ID': call.uniqueId,
          'Agent ID': call.callerNumber,
          'Client Number': call.calleeNumber,
          'Start Time': call.startTime,
          'End Time': call.endTime,
          'Duration (s)': call.callTime,
          'Talk Time (s)': call.talkTime,
          'Disposition': call.disposition,
          'Source Trunk': call.sourceTrunkName,
          'Destination Trunk': call.destinationTrunkName,
          'Caller Name': call.callerName
        }))
        dataToExport = [...dataToExport, ...callData]
        setExportProgress(66)
      }

      if (exportOptions.includePaymentData) {
        const paymentData = paymentRecords.map(payment => ({
          'Payment ID': payment.id,
          'Client Number': payment.clientNumber,
          'Amount': payment.amount,
          'Payment Date': payment.paymentDate,
          'Payment Method': payment.paymentMethod,
          'Status': payment.status,
          'Reference': payment.reference
        }))
        dataToExport = [...dataToExport, ...paymentData]
        setExportProgress(100)
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0]
      filename = `call-center-report-${timestamp}`

      // Export based on format
      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(dataToExport, `${filename}.csv`)
          break
        case 'excel':
          exportToExcel(dataToExport, `${filename}.xlsx`)
          break
        case 'pdf':
          exportToPDF(dataToExport, `${filename}.pdf`)
          break
      }

    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')

    downloadFile(csvContent, filename, 'text/csv')
  }

  const exportToExcel = (data: any[], filename: string) => {
    // For Excel export, we'll use CSV format for now
    // In a real implementation, you would use a library like xlsx
    exportToCSV(data, filename.replace('.xlsx', '.csv'))
  }

  const exportToPDF = (data: any[], filename: string) => {
    // For PDF export, we'll create a simple text format for now
    // In a real implementation, you would use a library like jsPDF
    let textContent = 'Call Center Analytics Report\n\n'
    
    if (exportOptions.includeAgentStats) {
      textContent += 'Agent Statistics:\n'
      textContent += data.filter(row => row['Agent ID']).map(row => 
        `${row['Agent ID']}: ${row['Total Calls']} calls, $${row['Total Revenue']} revenue`
      ).join('\n')
      textContent += '\n\n'
    }

    downloadFile(textContent, filename.replace('.pdf', '.txt'), 'text/plain')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getExportSize = () => {
    let size = 0
    if (exportOptions.includeCallData) size += callRecords.length
    if (exportOptions.includePaymentData) size += paymentRecords.length
    if (exportOptions.includeAgentStats) size += agentStats.length
    return size
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <CardTitle>Export Data</CardTitle>
        </div>
        <CardDescription>
          Export call center analytics data in various formats
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: 'csv' | 'excel' | 'pdf') => 
              setExportOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>CSV</span>
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Include Data</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeCallData}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeCallData: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Call Records ({callRecords.length} records)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includePaymentData}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includePaymentData: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Payment Records ({paymentRecords.length} records)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeAgentStats}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeAgentStats: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Agent Statistics ({agentStats.length} agents)</span>
            </label>
          </div>
        </div>

        {/* Export Summary */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Summary</label>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {exportOptions.format.toUpperCase()}
              </Badge>
              <span className="text-sm">
                {getExportSize()} records total
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {exportOptions.includeCallData && 'Calls • '}
              {exportOptions.includePaymentData && 'Payments • '}
              {exportOptions.includeAgentStats && 'Stats'}
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Progress</label>
            <Progress value={exportProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {exportProgress < 33 && 'Preparing agent statistics...'}
              {exportProgress >= 33 && exportProgress < 66 && 'Processing call records...'}
              {exportProgress >= 66 && exportProgress < 100 && 'Generating payment data...'}
              {exportProgress === 100 && 'Creating export file...'}
            </p>
          </div>
        )}

        {/* Export Button */}
        <Button 
          onClick={handleExport} 
          disabled={isExporting || getExportSize() === 0}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>

        {/* Export Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• CSV format is recommended for large datasets</p>
          <p>• Excel format includes formatting and formulas</p>
          <p>• PDF format is best for printed reports</p>
        </div>
      </CardContent>
    </Card>
  )
}