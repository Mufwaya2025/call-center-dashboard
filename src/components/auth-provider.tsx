'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Role, Permission } from '@/types/auth'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock user database
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      name: 'System Administrator',
      email: 'admin@callcenter.com',
      role: Role.ADMIN,
      permissions: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_REALTIME,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_DATA,
        Permission.MANAGE_USERS,
        Permission.MANAGE_SYSTEM,
        Permission.VIEW_ALL_DATA,
        Permission.EDIT_SETTINGS
      ],
      agentIds: [], // Admin can see all agents
      lastLogin: new Date().toISOString()
    },
    {
      id: '2',
      username: 'manager',
      name: 'Call Center Manager',
      email: 'manager@callcenter.com',
      role: Role.MANAGER,
      permissions: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_REALTIME,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_DATA,
        Permission.VIEW_TEAM_DATA,
        Permission.MANAGE_TEAM
      ],
      agentIds: ['1007', '1017', '1008'], // Manager can see specific agents
      lastLogin: new Date().toISOString()
    },
    {
      id: '3',
      username: 'supervisor',
      name: 'Team Supervisor',
      email: 'supervisor@callcenter.com',
      role: Role.SUPERVISOR,
      permissions: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_REALTIME,
        Permission.VIEW_REPORTS,
        Permission.VIEW_TEAM_DATA
      ],
      agentIds: ['1007', '1017'], // Supervisor can see specific agents
      lastLogin: new Date().toISOString()
    },
    {
      id: '4',
      username: 'agent1007',
      name: 'Agent 1007',
      email: 'agent1007@callcenter.com',
      role: Role.AGENT,
      permissions: [
        Permission.VIEW_OWN_PERFORMANCE,
        Permission.VIEW_OWN_DATA
      ],
      agentIds: ['1007'], // Agent can only see their own data
      lastLogin: new Date().toISOString()
    },
    {
      id: '5',
      username: 'analyst',
      name: 'Data Analyst',
      email: 'analyst@callcenter.com',
      role: Role.ANALYST,
      permissions: [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_DATA,
        Permission.VIEW_ALL_DATA
      ],
      agentIds: [], // Analyst can see all data but can't manage users/system
      lastLogin: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user (in real app, this would be an API call)
    const foundUser = mockUsers.find(u => u.username === username)
    
    if (foundUser && password === 'password') { // Mock password check
      const userWithLastLogin = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      }
      
      setUser(userWithLastLogin)
      localStorage.setItem('user', JSON.stringify(userWithLastLogin))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}