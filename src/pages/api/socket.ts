import { NextApiRequest, NextApiResponse } from 'next'
import { getSocketInstance, NextApiResponseWithSocket } from '@/lib/socket'

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket already initialized')
  } else {
    console.log('Initializing socket...')
    getSocketInstance(res)
  }
  res.end()
}