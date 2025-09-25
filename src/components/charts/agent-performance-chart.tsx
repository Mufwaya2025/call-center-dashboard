'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AgentData {
  agentId: string
  totalCalls: number
  answeredCalls: number
  conversionRate: number
  totalRevenue: number
  averageTalkTime: number
}

interface AgentPerformanceChartProps {
  data: AgentData[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AgentPerformanceChart({ data }: AgentPerformanceChartProps) {
  // Prepare data for different chart types
  const callsData = data.map(agent => ({
    agent: agent.agentId,
    total: agent.totalCalls,
    answered: agent.answeredCalls,
    conversionRate: agent.conversionRate
  }))

  const revenueData = data.map(agent => ({
    agent: agent.agentId,
    revenue: agent.totalRevenue,
    talkTime: agent.averageTalkTime
  }))

  const pieData = data.slice(0, 5).map(agent => ({
    name: agent.agentId,
    value: agent.totalRevenue
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calls by Agent Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Calls by Agent</CardTitle>
          <CardDescription>Total calls vs answered calls per agent</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="#8884d8" name="Total Calls" />
                <Bar dataKey="answered" fill="#82ca9d" name="Answered Calls" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue vs Talk Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Performance</CardTitle>
          <CardDescription>Revenue generated vs average talk time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="talkTime" stroke="#ff7300" name="Avg Talk Time (s)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Conversion Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>Payment conversion rate by agent</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="conversionRate" fill="#ffc658" name="Conversion Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Top 5 agents by revenue share</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}