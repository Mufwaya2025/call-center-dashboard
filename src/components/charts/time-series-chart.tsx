'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface TimeSeriesData {
  timestamp: string
  calls: number
  answered: number
  payments: number
  revenue: number
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Call Volume Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Call Volume Trends</CardTitle>
          <CardDescription>Total calls and answered calls over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="calls" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Calls" />
                <Area type="monotone" dataKey="answered" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Answered Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Revenue generated over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Payment Conversion Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Conversions</CardTitle>
          <CardDescription>Number of payments over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="payments" stroke="#00C49F" fill="#00C49F" name="Payments" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Combined Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Combined metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#8884d8" name="Calls" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ff7300" name="Revenue ($)" />
                <Line yAxisId="left" type="monotone" dataKey="payments" stroke="#00C49F" name="Payments" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}