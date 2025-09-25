'use client'

import { useAuth } from '@/components/auth-provider'
import { LoginForm } from '@/components/login-form'
import { Permission } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  fallback 
}: ProtectedRouteProps) {
  const { user, hasPermission, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Check if user has all required permissions
  const hasAllPermissions = requiredPermissions.every(permission => 
    hasPermission(permission)
  )

  if (!hasAllPermissions) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have the necessary permissions to access this resource.
          </p>
          <p className="text-sm text-muted-foreground">
            Required permissions: {requiredPermissions.join(', ')}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}