export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT',
  ANALYST = 'ANALYST'
}

export enum Permission {
  // Dashboard permissions
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_REALTIME = 'VIEW_REALTIME',
  
  // Data access permissions
  VIEW_ALL_DATA = 'VIEW_ALL_DATA',
  VIEW_TEAM_DATA = 'VIEW_TEAM_DATA',
  VIEW_OWN_DATA = 'VIEW_OWN_DATA',
  VIEW_OWN_PERFORMANCE = 'VIEW_OWN_PERFORMANCE',
  
  // Report permissions
  VIEW_REPORTS = 'VIEW_REPORTS',
  EXPORT_DATA = 'EXPORT_DATA',
  
  // Management permissions
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_TEAM = 'MANAGE_TEAM',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  
  // Settings permissions
  EDIT_SETTINGS = 'EDIT_SETTINGS'
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
  agentIds: string[] // IDs of agents this user can access
  lastLogin: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}