'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { CalendarIcon, Download, FileText, BarChart3, PieChart, TrendingUp, Clock, Phone, DollarSign, Users, Target, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportConfig {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  reportType: 'summary' | 'detailed' | 'performance' | 'financial' | 'trends'
  format: 'pdf' | 'excel' | 'csv' | 'json'
  includeCharts: boolean
  includeRecommendations: boolean
}

interface ReportData {
  summary: {
    totalCalls: number
    answeredCalls: number
    failedCalls: number
    noAnswerCalls: number
    answerRate: number
    averageTalkTime: number
    totalRevenue: number
    conversionRate: number
  }
  performance: {
    topAgents: Array<{
      agentId: string
      totalCalls: number
      answerRate: number
      revenue: number
      conversionRate: number
    }>
    worstPerforming: Array<{
      agentId: string
      totalCalls: number
      answerRate: number
      revenue: number
      conversionRate: number
    }>
  }
  trends: {
    callVolume: Array<{ date: string; calls: number }>
    revenue: Array<{ date: string; revenue: number }>
    answerRates: Array<{ date: string; rate: number }>
  }
  insights: {
    peakHours: Array<{ hour: number; calls: number }>
    bestTrunks: Array<{ trunk: string; successRate: number }>
    recommendations: string[]
  }
}

export function ComprehensiveReports() {
  const [config, setConfig] = useState<ReportConfig>({
    dateRange: {
      from: new Date(2025, 7, 1),
      to: new Date(2025, 7, 5)
    },
    reportType: 'summary',
    format: 'pdf',
    includeCharts: true,
    includeRecommendations: true
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockData: ReportData = {
      summary: {
        totalCalls: 1250,
        answeredCalls: 875,
        failedCalls: 200,
        noAnswerCalls: 175,
        answerRate: 70,
        averageTalkTime: 245,
        totalRevenue: 45600,
        conversionRate: 25.5
      },
      performance: {
        topAgents: [
          { agentId: '1007', totalCalls: 156, answerRate: 85, revenue: 8900, conversionRate: 32 },
          { agentId: '1017', totalCalls: 142, answerRate: 78, revenue: 7600, conversionRate: 28 },
          { agentId: '1008', totalCalls: 134, answerRate: 82, revenue: 7200, conversionRate: 30 }
        ],
        worstPerforming: [
          { agentId: '1028', totalCalls: 98, answerRate: 45, revenue: 1200, conversionRate: 12 },
          { agentId: '1029', totalCalls: 87, answerRate: 52, revenue: 1500, conversionRate: 15 }
        ]
      },
      trends: {
        callVolume: [
          { date: '2025-08-01', calls: 250 },
          { date: '2025-08-02', calls: 280 },
          { date: '2025-08-03', calls: 220 },
          { date: '2025-08-04', calls: 300 },
          { date: '2025-08-05', calls: 200 }
        ],
        revenue: [
          { date: '2025-08-01', revenue: 9200 },
          { date: '2025-08-02', revenue: 10500 },
          { date: '2025-08-03', revenue: 8800 },
          { date: '2025-08-04', revenue: 11200 },
          { date: '2025-08-05', revenue: 5900 }
        ],
        answerRates: [
          { date: '2025-08-01', rate: 72 },
          { date: '2025-08-02', rate: 75 },
          { date: '2025-08-03', rate: 68 },
          { date: '2025-08-04', rate: 78 },
          { date: '2025-08-05', rate: 65 }
        ]
      },
      insights: {
        peakHours: [
          { hour: 9, calls: 180 },
          { hour: 10, calls: 220 },
          { hour: 14, calls: 195 },
          { hour: 15, calls: 210 }
        ],
        bestTrunks: [
          { trunk: 'AZMNO_Recoveries_Morning', successRate: 78 },
          { trunk: 'DITC', successRate: 72 },
          { trunk: 'AZMNO_Recoveries_Afternoon', successRate: 68 }
        ],
        recommendations: [
          'Consider additional training for agents 1028 and 1029 to improve answer rates',
          'Peak call hours are 9-10 AM and 2-3 PM, consider staffing adjustments',
          'AZMNO_Recoveries_Morning trunk shows highest success rate, prioritize its usage',
          'Conversion rates drop significantly after 4 PM, consider shifting schedules',
          'Implement targeted coaching for agents with conversion rates below 20%'
        ]
      }
    }

    setReportData(mockData)
    setIsGenerating(false)
  }

  const downloadReport = () => {
    if (!reportData) return
    
    const reportContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([reportContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `call-center-report-${format(new Date(), 'yyyy-MM-dd')}.${config.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Comprehensive Report
          </CardTitle>
          <CardDescription>
            Configure and generate detailed call center analytics reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !config.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.dateRange.from ? format(config.dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.dateRange.from}
                    onSelect={(date) => setConfig({ ...config, dateRange: { ...config.dateRange, from: date } })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !config.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.dateRange.to ? format(config.dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.dateRange.to}
                    onSelect={(date) => setConfig({ ...config, dateRange: { ...config.dateRange, to: date } })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={config.reportType} onValueChange={(value: any) => setConfig({ ...config, reportType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="trends">Trends Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={config.format} onValueChange={(value: any) => setConfig({ ...config, format: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeCharts"
                checked={config.includeCharts}
                onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
              />
              <label htmlFor="includeCharts" className="text-sm">Include Charts</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeRecommendations"
                checked={config.includeRecommendations}
                onChange={(e) => setConfig({ ...config, includeRecommendations: e.target.checked })}
              />
              <label htmlFor="includeRecommendations" className="text-sm">Include Recommendations</label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            {reportData && (
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Calls</p>
                      <p className="text-2xl font-bold">{reportData.summary.totalCalls.toLocaleString()}</p>
                    </div>
                    <Phone className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Answer Rate</p>
                      <p className="text-2xl font-bold">{reportData.summary.answerRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">${reportData.summary.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{reportData.summary.conversionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Call Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Answered</span>
                    <div className="flex items-center gap-2">
                      <Progress value={reportData.summary.answerRate} className="w-24" />
                      <span className="text-sm">{reportData.summary.answeredCalls}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Failed</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(reportData.summary.failedCalls / reportData.summary.totalCalls) * 100} className="w-24" />
                      <span className="text-sm">{reportData.summary.failedCalls}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>No Answer</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(reportData.summary.noAnswerCalls / reportData.summary.totalCalls) * 100} className="w-24" />
                      <span className="text-sm">{reportData.summary.noAnswerCalls}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Calls</TableHead>
                        <TableHead>Answer Rate</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.performance.topAgents.map((agent) => (
                        <TableRow key={agent.agentId}>
                          <TableCell className="font-medium">{agent.agentId}</TableCell>
                          <TableCell>{agent.totalCalls}</TableCell>
                          <TableCell>
                            <Badge variant="default">{agent.answerRate}%</Badge>
                          </TableCell>
                          <TableCell>${agent.revenue.toLocaleString()}</TableCell>
                          <TableCell>{agent.conversionRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Needs Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Calls</TableHead>
                        <TableHead>Answer Rate</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.performance.worstPerforming.map((agent) => (
                        <TableRow key={agent.agentId}>
                          <TableCell className="font-medium">{agent.agentId}</TableCell>
                          <TableCell>{agent.totalCalls}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{agent.answerRate}%</Badge>
                          </TableCell>
                          <TableCell>${agent.revenue.toLocaleString()}</TableCell>
                          <TableCell>{agent.conversionRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Target className="h-4 w-4 mt-0.5 text-blue-500" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.insights.peakHours.map((peak) => (
                      <div key={peak.hour} className="flex items-center justify-between">
                        <span>{peak.hour}:00</span>
                        <Badge variant="outline">{peak.calls} calls</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Performing Trunks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.insights.bestTrunks.map((trunk) => (
                      <div key={trunk.trunk} className="flex items-center justify-between">
                        <span>{trunk.trunk}</span>
                        <Badge variant="default">{trunk.successRate}% success</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}