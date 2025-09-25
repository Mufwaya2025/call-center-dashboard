import { Server } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: {
      io?: Server
    }
  }
}

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

export class CallCenterSocket {
  private io: Server
  private liveCalls: Map<string, LiveCall> = new Map()
  private stats: RealTimeStats = {
    activeCalls: 0,
    totalCallsToday: 0,
    answeredCalls: 0,
    averageWaitTime: 0,
    revenueToday: 0
  }

  constructor(res: NextApiResponseWithSocket) {
    if (!res.socket.server.io) {
      this.io = new Server(res.socket.server, {
        path: '/api/socket',
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      })
      res.socket.server.io = this.io
      this.setupEventHandlers()
    } else {
      this.io = res.socket.server.io
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Send current state to new client
      socket.emit('live-calls', Array.from(this.liveCalls.values()))
      socket.emit('stats-updated', this.stats)

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  // Simulate call events (in real implementation, these would come from your PBX/CTI system)
  public simulateCallStart() {
    const callId = Math.random().toString(36).substr(2, 9)
    const agentId = `100${Math.floor(Math.random() * 9) + 1}`
    const clientNumber = `095${Math.floor(Math.random() * 9000000) + 1000000}`
    const trunk = ['AZMNO_Recoveries_Morning', 'DITC', 'AZMNO_Recoveries_Afternoon'][Math.floor(Math.random() * 3)]
    
    const call: LiveCall = {
      id: callId,
      agentId,
      clientNumber,
      startTime: new Date().toISOString(),
      duration: 0,
      status: 'ringing',
      trunk
    }

    this.liveCalls.set(callId, call)
    this.stats.activeCalls++
    this.stats.totalCallsToday++

    this.io.emit('call-started', call)
    this.io.emit('stats-updated', this.stats)

    // Simulate call progression
    setTimeout(() => {
      this.updateCallStatus(callId, 'connected')
    }, Math.random() * 10000 + 5000) // 5-15 seconds

    setTimeout(() => {
      this.endCall(callId)
    }, Math.random() * 30000 + 20000) // 20-50 seconds
  }

  public updateCallStatus(callId: string, status: LiveCall['status']) {
    const call = this.liveCalls.get(callId)
    if (call) {
      call.status = status
      if (status === 'connected') {
        this.stats.answeredCalls++
      }
      this.io.emit('call-updated', call)
      this.io.emit('stats-updated', this.stats)
    }
  }

  public endCall(callId: string) {
    const call = this.liveCalls.get(callId)
    if (call) {
      call.status = 'ended'
      this.stats.activeCalls = Math.max(0, this.stats.activeCalls - 1)
      
      // Simulate revenue generation
      if (call.status === 'connected' && Math.random() > 0.7) {
        const revenue = Math.floor(Math.random() * 500) + 50
        this.stats.revenueToday += revenue
      }

      this.io.emit('call-ended', callId)
      this.io.emit('stats-updated', this.stats)
      
      this.liveCalls.delete(callId)
    }
  }

  public getStats(): RealTimeStats {
    return { ...this.stats }
  }

  public getLiveCalls(): LiveCall[] {
    return Array.from(this.liveCalls.values())
  }
}

// Singleton instance
let socketInstance: CallCenterSocket | null = null

export function getSocketInstance(res: NextApiResponseWithSocket): CallCenterSocket {
  if (!socketInstance) {
    socketInstance = new CallCenterSocket(res)
  }
  return socketInstance
}