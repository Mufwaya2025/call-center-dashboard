'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Upload, Download, Phone, DollarSign, TrendingUp, Users, Clock, BarChart3, Settings, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RealTimeMonitor } from '@/components/real-time-monitor'
import { ProtectedRoute } from '@/components/protected-route'
import { UserInfo } from '@/components/user-info'
import { AgentPerformanceChart } from '@/components/charts/agent-performance-chart'
import { TimeSeriesChart } from '@/components/charts/time-series-chart'
import { PaymentConversionTracker } from '@/components/payment-conversion-tracker'
import { FilterPanel, FilterState } from '@/components/filter-panel'
import { ExportPanel } from '@/components/export-panel'
import { ColumnMapper } from '@/components/column-mapper'
import { PaymentColumnMapper } from '@/components/payment-column-mapper'
import { AdvancedFilterPanel } from '@/components/advanced-filter-panel'
import { ComprehensiveReports } from '@/components/comprehensive-reports'
import { Permission } from '@/types/auth'

interface CallRecord {
  id: string
  accountCode: string
  callerNumber: string
  calleeNumber: string
  context: string
  callerId: string
  sourceChannel: string
  destChannel: string
  lastApp: string
  lastDate: string
  startTime: string
  answerTime: string
  endTime: string
  callTime: number
  talkTime: number
  disposition: 'ANSWERED' | 'FAILED' | 'NO ANSWER'
  amaFlags: string
  uniqueId: string
  logUserfield: string
  destChannelExtension: string
  callerName: string
  answeredBy: string
  session: string
  premierCaller: string
  actionType: string
  sourceTrunkName: string
  destinationTrunkName: string
}

interface PaymentRecord {
  id: string
  clientNumber: string
  amount: number
  paymentDate: string
  paymentMethod: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  reference: string
}

interface AgentStats {
  agentId: string
  totalCalls: number
  answeredCalls: number
  failedCalls: number
  noAnswerCalls: number
  totalTalkTime: number
  averageTalkTime: number
  answerRate: number
  callsWithPayment: number
  totalRevenue: number
  conversionRate: number
  averageTimeToPayment: number
}

export default function CallCenterDashboard() {
  return (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const [callRecords, setCallRecords] = useState<CallRecord[]>([])
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([])
  const [agentStats, setAgentStats] = useState<AgentStats[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [filters, setFilters] = useState<FilterState | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2025, 7, 1), // August 1, 2025
    to: new Date(2025, 7, 5),   // August 5, 2025
  })
  
  // Column mapping state
  const [showCallColumnMapper, setShowCallColumnMapper] = useState(false)
  const [showPaymentColumnMapper, setShowPaymentColumnMapper] = useState(false)
  const [callColumnMapping, setCallColumnMapping] = useState<{[key: string]: string}>({})
  const [paymentColumnMapping, setPaymentColumnMapping] = useState<{[key: string]: string}>({})
  const [detectedCallColumns, setDetectedCallColumns] = useState<string[]>([])
  const [detectedPaymentColumns, setDetectedPaymentColumns] = useState<string[]>([])
  
  // Required fields for mapping
  const callRequiredFields = ['callerNumber', 'calleeNumber', 'startTime', 'talkTime', 'disposition']
  const paymentRequiredFields = ['clientNumber', 'amount', 'paymentDate', 'status']

  const calculateAgentStatsForData = (calls: CallRecord[], payments: PaymentRecord[]) => {
    const agentMap = new Map<string, AgentStats>()

    calls.forEach(call => {
      if (!agentMap.has(call.callerNumber)) {
        agentMap.set(call.callerNumber, {
          agentId: call.callerNumber,
          totalCalls: 0,
          answeredCalls: 0,
          failedCalls: 0,
          noAnswerCalls: 0,
          totalTalkTime: 0,
          averageTalkTime: 0,
          answerRate: 0,
          callsWithPayment: 0,
          totalRevenue: 0,
          conversionRate: 0,
          averageTimeToPayment: 0,
        })
      }

      const stats = agentMap.get(call.callerNumber)!
      stats.totalCalls++
      
      if (call.disposition === 'ANSWERED') {
        stats.answeredCalls++
        stats.totalTalkTime += call.talkTime
      } else if (call.disposition === 'FAILED') {
        stats.failedCalls++
      } else if (call.disposition === 'NO ANSWER') {
        stats.noAnswerCalls++
      }
    })

    // Calculate payment conversions
    agentMap.forEach(stats => {
      stats.averageTalkTime = stats.answeredCalls > 0 ? stats.totalTalkTime / stats.answeredCalls : 0
      stats.answerRate = stats.totalCalls > 0 ? (stats.answeredCalls / stats.totalCalls) * 100 : 0

      // Find payments for this agent's calls
      const agentCalls = calls.filter(call => call.callerNumber === stats.agentId && call.disposition === 'ANSWERED')
      const clientNumbers = new Set(agentCalls.map(call => call.calleeNumber))
      
      payments.forEach(payment => {
        if (clientNumbers.has(payment.clientNumber) && payment.status === 'SUCCESS') {
          stats.callsWithPayment++
          stats.totalRevenue += payment.amount
          
          // Calculate time to payment (simplified)
          const relatedCall = agentCalls.find(call => call.calleeNumber === payment.clientNumber)
          if (relatedCall) {
            const callTime = new Date(relatedCall.startTime)
            const paymentTime = new Date(payment.paymentDate)
            const timeDiff = (paymentTime.getTime() - callTime.getTime()) / (1000 * 60) // minutes
            stats.averageTimeToPayment += timeDiff
          }
        }
      })

      stats.conversionRate = stats.answeredCalls > 0 ? (stats.callsWithPayment / stats.answeredCalls) * 100 : 0
      stats.averageTimeToPayment = stats.callsWithPayment > 0 ? stats.averageTimeToPayment / stats.callsWithPayment : 0
    })

    return Array.from(agentMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue)
  }

  const handleCallFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length > 0) {
        // Detect columns from header row
        const headerRow = lines[0]
        const columns = headerRow.split(',').map(col => col.trim().replace(/^"|"$/g, ''))
        setDetectedCallColumns(columns)
        
        // Try to auto-map columns
        const autoMapping: {[key: string]: string} = {}
        const fieldLabels: {[key: string]: string} = {
          callerNumber: 'caller number',
          calleeNumber: 'callee number', 
          startTime: 'start time',
          talkTime: 'talk time',
          disposition: 'disposition',
          id: 'id',
          accountCode: 'account code',
          context: 'context',
          callerId: 'caller id',
          sourceChannel: 'source channel',
          destChannel: 'dest channel',
          lastApp: 'last app',
          lastDate: 'last date',
          answerTime: 'answer time',
          endTime: 'end time',
          callTime: 'call time',
          amaFlags: 'ama flags',
          uniqueId: 'unique id',
          logUserfield: 'log userfield',
          destChannelExtension: 'dest channel extension',
          callerName: 'caller name',
          answeredBy: 'answered by',
          session: 'session',
          premierCaller: 'premier caller',
          actionType: 'action type',
          sourceTrunkName: 'source trunk name',
          destinationTrunkName: 'destination trunk name'
        }
        
        Object.entries(fieldLabels).forEach(([field, label]) => {
          const matchingIndex = columns.findIndex(col => 
            col.toLowerCase().includes(label) || 
            label.includes(col.toLowerCase())
          )
          if (matchingIndex !== -1) {
            autoMapping[field] = matchingIndex.toString()
          }
        })
        
        setCallColumnMapping(autoMapping)
        setShowCallColumnMapper(true)
        
        // Store the file data for later processing
        const fileData = { text, columns }
        localStorage.setItem('callFileData', JSON.stringify(fileData))
      }
    }
    reader.readAsText(file)
  }, [])

  const handlePaymentFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length > 0) {
        // Detect columns from header row
        const headerRow = lines[0]
        const columns = headerRow.split(',').map(col => col.trim().replace(/^"|"$/g, ''))
        setDetectedPaymentColumns(columns)
        
        // Try to auto-map columns
        const autoMapping: {[key: string]: string} = {}
        const fieldLabels: {[key: string]: string} = {
          clientNumber: 'client number',
          amount: 'amount',
          paymentDate: 'payment date',
          paymentMethod: 'payment method',
          status: 'status',
          id: 'id',
          reference: 'reference'
        }
        
        Object.entries(fieldLabels).forEach(([field, label]) => {
          const matchingIndex = columns.findIndex(col => 
            col.toLowerCase().includes(label) || 
            label.includes(col.toLowerCase())
          )
          if (matchingIndex !== -1) {
            autoMapping[field] = matchingIndex.toString()
          }
        })
        
        setPaymentColumnMapping(autoMapping)
        setShowPaymentColumnMapper(true)
        
        // Store the file data for later processing
        const fileData = { text, columns }
        localStorage.setItem('paymentFileData', JSON.stringify(fileData))
      }
    }
    reader.readAsText(file)
  }, [])

  const parseCallData = (data: string, mapping: {[key: string]: string} = {}) => {
    setIsProcessing(true)
    const lines = data.split('\n').filter(line => line.trim())
    const records: CallRecord[] = []

    // Skip header line and process data
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''))
      if (columns.length >= Math.max(...Object.values(mapping).map(Number)) + 1) {
        records.push({
          id: columns[parseInt(mapping.id || '0')] || i.toString(),
          accountCode: columns[parseInt(mapping.accountCode || '1')] || '',
          callerNumber: columns[parseInt(mapping.callerNumber || '2')] || '',
          calleeNumber: columns[parseInt(mapping.calleeNumber || '3')] || '',
          context: columns[parseInt(mapping.context || '4')] || '',
          callerId: columns[parseInt(mapping.callerId || '5')] || '',
          sourceChannel: columns[parseInt(mapping.sourceChannel || '6')] || '',
          destChannel: columns[parseInt(mapping.destChannel || '7')] || '',
          lastApp: columns[parseInt(mapping.lastApp || '8')] || '',
          lastDate: columns[parseInt(mapping.lastDate || '9')] || '',
          startTime: columns[parseInt(mapping.startTime || '10')] || '',
          answerTime: columns[parseInt(mapping.answerTime || '11')] || '',
          endTime: columns[parseInt(mapping.endTime || '12')] || '',
          callTime: parseInt(columns[parseInt(mapping.callTime || '13')] || '0') || 0,
          talkTime: parseInt(columns[parseInt(mapping.talkTime || '14')] || '0') || 0,
          disposition: (columns[parseInt(mapping.disposition || '15')] as 'ANSWERED' | 'FAILED' | 'NO ANSWER') || 'FAILED',
          amaFlags: columns[parseInt(mapping.amaFlags || '16')] || '',
          uniqueId: columns[parseInt(mapping.uniqueId || '17')] || '',
          logUserfield: columns[parseInt(mapping.logUserfield || '18')] || '',
          destChannelExtension: columns[parseInt(mapping.destChannelExtension || '19')] || '',
          callerName: columns[parseInt(mapping.callerName || '20')] || '',
          answeredBy: columns[parseInt(mapping.answeredBy || '21')] || '',
          session: columns[parseInt(mapping.session || '22')] || '',
          premierCaller: columns[parseInt(mapping.premierCaller || '23')] || '',
          actionType: columns[parseInt(mapping.actionType || '24')] || '',
          sourceTrunkName: columns[parseInt(mapping.sourceTrunkName || '25')] || '',
          destinationTrunkName: columns[parseInt(mapping.destinationTrunkName || '26')] || '',
        })
      }
    }

    setCallRecords(records)
    setAgentStats(calculateAgentStatsForData(records, paymentRecords))
    setIsProcessing(false)
  }

  const parsePaymentData = (data: string, mapping: {[key: string]: string} = {}) => {
    setIsProcessing(true)
    const lines = data.split('\n').filter(line => line.trim())
    const records: PaymentRecord[] = []

    // Skip header line and process data
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''))
      if (columns.length >= Math.max(...Object.values(mapping).map(Number)) + 1) {
        records.push({
          id: columns[parseInt(mapping.id || '0')] || i.toString(),
          clientNumber: columns[parseInt(mapping.clientNumber || '1')] || '',
          amount: parseFloat(columns[parseInt(mapping.amount || '2')] || '0') || 0,
          paymentDate: columns[parseInt(mapping.paymentDate || '3')] || '',
          paymentMethod: columns[parseInt(mapping.paymentMethod || '4')] || '',
          status: (columns[parseInt(mapping.status || '5')] as 'SUCCESS' | 'FAILED' | 'PENDING') || 'FAILED',
          reference: columns[parseInt(mapping.reference || '6')] || ''
        })
      }
    }

    setPaymentRecords(records)
    setAgentStats(calculateAgentStatsForData(callRecords, records))
    setIsProcessing(false)
  }

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleCallColumnMapping = useCallback((mapping: {[key: string]: string}) => {
    setCallColumnMapping(mapping)
    setShowCallColumnMapper(false)
    
    // Process the stored file data with the new mapping
    const storedData = localStorage.getItem('callFileData')
    if (storedData) {
      const { text } = JSON.parse(storedData)
      parseCallData(text, mapping)
    }
  }, [])

  const handlePaymentColumnMapping = useCallback((mapping: {[key: string]: string}) => {
    setPaymentColumnMapping(mapping)
    setShowPaymentColumnMapper(false)
    
    // Process the stored file data with the new mapping
    const storedData = localStorage.getItem('paymentFileData')
    if (storedData) {
      const { text } = JSON.parse(storedData)
      parsePaymentData(text, mapping)
    }
  }, [])

  const getFilteredData = () => {
    if (!filters) {
      return {
        filteredCalls: callRecords,
        filteredPayments: paymentRecords,
        filteredAgentStats: agentStats
      }
    }

    let filteredCalls = callRecords
    let filteredPayments = paymentRecords

    // Apply date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filteredCalls = filteredCalls.filter(call => {
        const callDate = new Date(call.startTime)
        return callDate >= filters.dateRange!.from && callDate <= filters.dateRange!.to
      })
      filteredPayments = filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate)
        return paymentDate >= filters.dateRange!.from && paymentDate <= filters.dateRange!.to
      })
    }

    // Apply agent filter
    if (filters.agents.length > 0) {
      filteredCalls = filteredCalls.filter(call => filters.agents!.includes(call.callerNumber))
    }

    // Apply disposition filter
    if (filters.dispositions.length > 0) {
      filteredCalls = filteredCalls.filter(call => filters.dispositions!.includes(call.disposition))
    }

    // Apply talk time filter
    if (filters.minTalkTime !== null) {
      filteredCalls = filteredCalls.filter(call => call.talkTime >= filters.minTalkTime!)
    }
    if (filters.maxTalkTime !== null) {
      filteredCalls = filteredCalls.filter(call => call.talkTime <= filters.maxTalkTime!)
    }

    // Apply amount filter for payments
    if (filters.minAmount !== null) {
      filteredPayments = filteredPayments.filter(payment => payment.amount >= filters.minAmount!)
    }
    if (filters.maxAmount !== null) {
      filteredPayments = filteredPayments.filter(payment => payment.amount <= filters.maxAmount!)
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredCalls = filteredCalls.filter(call => 
        call.callerNumber.toLowerCase().includes(query) ||
        call.calleeNumber.toLowerCase().includes(query) ||
        call.callerName.toLowerCase().includes(query)
      )
      filteredPayments = filteredPayments.filter(payment =>
        payment.clientNumber.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query)
      )
    }

    // Recalculate agent stats for filtered data
    const filteredAgentStats = calculateAgentStatsForData(filteredCalls, filteredPayments)

    return {
      filteredCalls,
      filteredPayments,
      filteredAgentStats
    }
  }

  const { filteredCalls, filteredPayments, filteredAgentStats } = getFilteredData()

  const getOverallStats = () => {
    const totalCalls = filteredCalls.length
    const answeredCalls = filteredCalls.filter(c => c.disposition === 'ANSWERED').length
    const totalRevenue = filteredAgentStats.reduce((sum, stat) => sum + stat.totalRevenue, 0)
    const totalAgents = filteredAgentStats.length
    const avgConversionRate = filteredAgentStats.length > 0 ? filteredAgentStats.reduce((sum, stat) => sum + stat.conversionRate, 0) / filteredAgentStats.length : 0

    return {
      totalCalls,
      answeredCalls,
      totalRevenue,
      totalAgents,
      avgConversionRate,
      answerRate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0
    }
  }

  const overallStats = getOverallStats()

  const generateTimeSeriesData = () => {
    // Generate sample time series data based on call records
    const hourlyData = new Map<string, { calls: number; answered: number; payments: number; revenue: number }>()
    
    filteredCalls.forEach(call => {
      const hour = call.startTime.substring(0, 13) // Extract hour from timestamp
      if (!hourlyData.has(hour)) {
        hourlyData.set(hour, { calls: 0, answered: 0, payments: 0, revenue: 0 })
      }
      const data = hourlyData.get(hour)!
      data.calls++
      if (call.disposition === 'ANSWERED') {
        data.answered++
      }
    })

    // Add payment data
    filteredPayments.forEach(payment => {
      const hour = payment.paymentDate.substring(0, 13)
      if (hourlyData.has(hour)) {
        const data = hourlyData.get(hour)!
        data.payments++
        data.revenue += payment.amount
      }
    })

    return Array.from(hourlyData.entries()).map(([timestamp, data]) => ({
      timestamp,
      ...data
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Call Center Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor agent performance and payment conversion metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserInfo />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to })
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Upload
            </CardTitle>
            <CardDescription>
              Upload call logs and payment data to generate analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="call-file" className="text-sm font-medium">
                    Call Logs (CSV)
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCallColumnMapper(true)}
                    disabled={detectedCallColumns.length === 0}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Columns
                  </Button>
                </div>
                <Input
                  id="call-file"
                  type="file"
                  accept=".csv"
                  onChange={handleCallFileUpload}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">
                  Upload PBX call log data in CSV format. Configure columns to map your data fields.
                </p>
                {detectedCallColumns.length > 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ {detectedCallColumns.length} columns detected. Click "Configure Columns" to customize mapping.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="payment-file" className="text-sm font-medium">
                    Payment Data (CSV)
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPaymentColumnMapper(true)}
                    disabled={detectedPaymentColumns.length === 0}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Columns
                  </Button>
                </div>
                <Input
                  id="payment-file"
                  type="file"
                  accept=".csv"
                  onChange={handlePaymentFileUpload}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">
                  Upload payment transaction data in CSV format. Configure columns to map your data fields.
                </p>
                {detectedPaymentColumns.length > 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ {detectedPaymentColumns.length} columns detected. Click "Configure Columns" to customize mapping.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Panel */}
        <FilterPanel 
          agents={Array.from(new Set(callRecords.map(call => call.callerNumber)))} 
          onFiltersChange={handleFiltersChange}
        />

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {overallStats.answeredCalls.toLocaleString()} answered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Answer Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.answerRate.toFixed(1)}%</div>
              <Progress value={overallStats.answerRate} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overallStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {agentStats.reduce((sum, stat) => sum + stat.callsWithPayment, 0)} payments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                Avg conversion: {overallStats.avgConversionRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Time to Payment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agentStats.length > 0 
                  ? (agentStats.reduce((sum, stat) => sum + stat.averageTimeToPayment, 0) / agentStats.length).toFixed(0)
                  : 0
                }m
              </div>
              <p className="text-xs text-muted-foreground">
                From call to payment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="conversions">Payment Conversions</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="calls">Call Details</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <ProtectedRoute requiredPermissions={[Permission.VIEW_REALTIME]}>
              <RealTimeMonitor />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed performance statistics for each call center agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent ID</TableHead>
                      <TableHead>Total Calls</TableHead>
                      <TableHead>Answer Rate</TableHead>
                      <TableHead>Avg Talk Time</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgentStats.map((agent) => (
                      <TableRow key={agent.agentId}>
                        <TableCell className="font-medium">{agent.agentId}</TableCell>
                        <TableCell>{agent.totalCalls}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={agent.answerRate} className="w-16" />
                            <span className="text-sm">{agent.answerRate.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{agent.averageTalkTime.toFixed(0)}s</TableCell>
                        <TableCell>{agent.callsWithPayment}</TableCell>
                        <TableCell>${agent.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={agent.conversionRate > 20 ? "default" : "secondary"}>
                            {agent.conversionRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <PaymentConversionTracker callRecords={filteredCalls} paymentRecords={filteredPayments} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Agent Performance Analytics
                  </CardTitle>
                  <CardDescription>
                    Visual representation of agent performance metrics
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Time Series Analytics
                  </CardTitle>
                  <CardDescription>
                    Trends and patterns over time
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            <AgentPerformanceChart data={filteredAgentStats} />
            
            <Card>
              <CardHeader>
                <CardTitle>Time Series Analysis</CardTitle>
                <CardDescription>
                  Call volume and revenue trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart data={generateTimeSeriesData()} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ProtectedRoute requiredPermissions={[Permission.VIEW_REPORTS]}>
              <ComprehensiveReports />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <ProtectedRoute requiredPermissions={[Permission.EXPORT_DATA]}>
              <ExportPanel 
                callRecords={filteredCalls}
                paymentRecords={filteredPayments}
                agentStats={filteredAgentStats}
              />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Call Activity</CardTitle>
                <CardDescription>
                  Detailed view of recent call logs and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCalls.slice(0, 20).map((call) => (
                    <div key={call.uniqueId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          call.disposition === 'ANSWERED' ? 'default' : 
                          call.disposition === 'FAILED' ? 'destructive' : 'secondary'
                        }>
                          {call.disposition}
                        </Badge>
                        <div>
                          <div className="font-medium">{call.callerNumber} → {call.calleeNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {call.startTime} • {call.talkTime}s talk time
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{call.sourceTrunkName}</div>
                        <div className="text-xs text-muted-foreground">{call.destinationTrunkName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Column Mapper Modals */}
      {showCallColumnMapper && (
        <ColumnMapper
          columns={detectedCallColumns}
          requiredFields={callRequiredFields}
          onMappingChange={handleCallColumnMapping}
          onClose={() => setShowCallColumnMapper(false)}
          initialMapping={callColumnMapping}
        />
      )}
      
      {showPaymentColumnMapper && (
        <PaymentColumnMapper
          columns={detectedPaymentColumns}
          requiredFields={paymentRequiredFields}
          onMappingChange={handlePaymentColumnMapping}
          onClose={() => setShowPaymentColumnMapper(false)}
          initialMapping={paymentColumnMapping}
        />
      )}
    </div>
  )
}