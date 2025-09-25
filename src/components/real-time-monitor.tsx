'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Phone, PhoneOff, Clock, DollarSign, Users, Activity } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface LiveCall {
  id: string
  agentId: string
  clientNumber: string
  startTime: string
  duration: number
  status: 'ringing' | 'connected' | 'ended'
  trunk: string
}

interface RealTimeStats {
  activeCalls: number
  totalCallsToday: number
  answeredCalls: number
  averageWaitTime: number
  revenueToday: number
}

export function RealTimeMonitor() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([])
  const [stats, setStats] = useState<RealTimeStats>({
    activeCalls: 0,
    totalCallsToday: 0,
    answeredCalls: 0,
    averageWaitTime: 0,
    revenueToday: 0
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to real-time monitoring')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from real-time monitoring')
    })

    // Listen for live call updates
    newSocket.on('call-started', (call: LiveCall) => {
      setLiveCalls(prev => [...prev, call])
      setStats(prev => ({ ...prev, activeCalls: prev.activeCalls + 1 }))
    })

    newSocket.on('call-updated', (call: LiveCall) => {
      setLiveCalls(prev => 
        prev.map(c => c.id === call.id ? call : c)
      )
    })

    newSocket.on('call-ended', (callId: string) => {
      setLiveCalls(prev => prev.filter(c => c.id !== callId))
      setStats(prev => ({ ...prev, activeCalls: Math.max(0, prev.activeCalls - 1) }))
    })

    newSocket.on('stats-updated', (newStats: RealTimeStats) => {
      setStats(newStats)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: LiveCall['status']) => {
    switch (status) {
      case 'ringing': return 'bg-yellow-500'
      case 'connected': return 'bg-green-500'
      case 'ended': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: LiveCall['status']) => {
    switch (status) {
      case 'ringing': return <Phone className="h-4 w-4" />
      case 'connected': return <Phone className="h-4 w-4" />
      case 'ended': return <PhoneOff className="h-4 w-4" />
      default: return <PhoneOff className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Monitoring
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Live call monitoring and real-time statistics
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Calls</p>
                <p className="text-2xl font-bold">{stats.activeCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-2xl font-bold">{stats.totalCallsToday}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Answer Rate</p>
                <p className="text-2xl font-bold">
                  {stats.totalCallsToday > 0 
                    ? Math.round((stats.answeredCalls / stats.totalCallsToday) * 100) 
                    : 0}%
                </p>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageWaitTime)}s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold">${stats.revenueToday.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Live Calls</CardTitle>
          <CardDescription>
            Currently active calls in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {liveCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active calls at the moment
            </div>
          ) : (
            <div className="space-y-4">
              {liveCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(call.status)}`}>
                      {getStatusIcon(call.status)}
                    </div>
                    <div>
                      <p className="font-medium">Agent {call.agentId}</p>
                      <p className="text-sm text-muted-foreground">
                        {call.clientNumber} • {call.trunk}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatDuration(call.duration)}</p>
                    <Badge variant="outline" className="capitalize">
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}