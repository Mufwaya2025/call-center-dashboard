'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, DollarSign, TrendingUp, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface CallRecord {
  id: string
  callerNumber: string
  calleeNumber: string
  startTime: string
  endTime: string
  disposition: 'ANSWERED' | 'FAILED' | 'NO ANSWER'
  talkTime: number
  uniqueId: string
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

interface ConversionData {
  callId: string
  agentId: string
  clientNumber: string
  callTime: string
  talkTime: number
  paymentAmount: number
  paymentTime: string
  timeToPayment: number
  paymentMethod: string
  paymentStatus: string
}

interface PaymentConversionTrackerProps {
  callRecords: CallRecord[]
  paymentRecords: PaymentRecord[]
}

export function PaymentConversionTracker({ callRecords, paymentRecords }: PaymentConversionTrackerProps) {
  // Match calls with payments
  const conversionData: ConversionData[] = []

  callRecords.forEach(call => {
    if (call.disposition === 'ANSWERED') {
      const matchingPayment = paymentRecords.find(payment => 
        payment.clientNumber === call.calleeNumber && 
        payment.status === 'SUCCESS'
      )

      if (matchingPayment) {
        const callTime = new Date(call.startTime)
        const paymentTime = new Date(matchingPayment.paymentDate)
        const timeToPayment = (paymentTime.getTime() - callTime.getTime()) / (1000 * 60) // minutes

        conversionData.push({
          callId: call.uniqueId,
          agentId: call.callerNumber,
          clientNumber: call.calleeNumber,
          callTime: call.startTime,
          talkTime: call.talkTime,
          paymentAmount: matchingPayment.amount,
          paymentTime: matchingPayment.paymentDate,
          timeToPayment,
          paymentMethod: matchingPayment.paymentMethod,
          paymentStatus: matchingPayment.status
        })
      }
    }
  })

  // Calculate conversion metrics
  const totalAnsweredCalls = callRecords.filter(c => c.disposition === 'ANSWERED').length
  const totalConversions = conversionData.length
  const conversionRate = totalAnsweredCalls > 0 ? (totalConversions / totalAnsweredCalls) * 100 : 0
  const totalRevenue = conversionData.reduce((sum, conv) => sum + conv.paymentAmount, 0)
  const averageTimeToPayment = totalConversions > 0 ? 
    conversionData.reduce((sum, conv) => sum + conv.timeToPayment, 0) / totalConversions : 0

  // Group by agent
  const agentConversions = conversionData.reduce((acc, conv) => {
    if (!acc[conv.agentId]) {
      acc[conv.agentId] = {
        agentId: conv.agentId,
        conversions: 0,
        revenue: 0,
        avgTimeToPayment: 0,
        totalCalls: 0
      }
    }
    acc[conv.agentId].conversions++
    acc[conv.agentId].revenue += conv.paymentAmount
    acc[conv.agentId].avgTimeToPayment += conv.timeToPayment
    return acc
  }, {} as Record<string, any>)

  // Calculate total calls per agent
  callRecords.forEach(call => {
    if (call.disposition === 'ANSWERED' && agentConversions[call.callerNumber]) {
      agentConversions[call.callerNumber].totalCalls++
    }
  })

  // Calculate averages
  Object.values(agentConversions).forEach((agent: any) => {
    agent.avgTimeToPayment = agent.conversions > 0 ? agent.avgTimeToPayment / agent.conversions : 0
    agent.conversionRate = agent.totalCalls > 0 ? (agent.conversions / agent.totalCalls) * 100 : 0
  })

  // Payment method distribution
  const paymentMethodDistribution = conversionData.reduce((acc, conv) => {
    acc[conv.paymentMethod] = (acc[conv.paymentMethod] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Time to payment ranges
  const timeRanges = [
    { label: '0-15 min', min: 0, max: 15 },
    { label: '15-30 min', min: 15, max: 30 },
    { label: '30-60 min', min: 30, max: 60 },
    { label: '1-2 hours', min: 60, max: 120 },
    { label: '2+ hours', min: 120, max: Infinity }
  ]

  const timeRangeDistribution = timeRanges.map(range => ({
    ...range,
    count: conversionData.filter(conv => 
      conv.timeToPayment >= range.min && conv.timeToPayment < range.max
    ).length
  }))

  return (
    <div className="space-y-6">
      {/* Conversion Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalConversions} of {totalAnsweredCalls} calls
            </p>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {totalConversions} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Payment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTimeToPayment.toFixed(0)}m</div>
            <p className="text-xs text-muted-foreground">
              From call to payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(agentConversions).length}</div>
            <p className="text-xs text-muted-foreground">
              With conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Conversion Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Conversion Performance</CardTitle>
            <CardDescription>
              Conversion rates and revenue by agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(agentConversions)
                  .sort((a: any, b: any) => b.revenue - a.revenue)
                  .slice(0, 10)
                  .map((agent: any) => (
                    <TableRow key={agent.agentId}>
                      <TableCell className="font-medium">{agent.agentId}</TableCell>
                      <TableCell>{agent.conversions}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={agent.conversionRate} className="w-16" />
                          <span className="text-sm">{agent.conversionRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>${agent.revenue.toLocaleString()}</TableCell>
                      <TableCell>{agent.avgTimeToPayment.toFixed(0)}m</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>
              Breakdown of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(paymentMethodDistribution).map(([method, count]) => {
                const percentage = totalConversions > 0 ? (count / totalConversions) * 100 : 0
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{method.replace('_', ' ')}</span>
                      <span>{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time to Payment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Payment Analysis</CardTitle>
          <CardDescription>
            How quickly customers make payments after calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {timeRangeDistribution.map(range => {
              const percentage = totalConversions > 0 ? (range.count / totalConversions) * 100 : 0
              return (
                <div key={range.label} className="text-center">
                  <div className="text-2xl font-bold">{range.count}</div>
                  <div className="text-sm text-muted-foreground">{range.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}%</div>
                  <Progress value={percentage} className="mt-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
          <CardDescription>
            Latest successful call-to-payment conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {conversionData
              .sort((a, b) => new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime())
              .slice(0, 20)
              .map(conv => (
                <div key={conv.callId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">{conv.agentId} → {conv.clientNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {conv.callTime} • {conv.talkTime}s talk
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${conv.paymentAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {conv.timeToPayment.toFixed(0)}m • {conv.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}