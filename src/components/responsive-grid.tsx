'use client'

import { ReactNode } from 'react'

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className = '' }: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 'full'
}

export function ResponsiveCard({ children, className = '', cols = 1 }: ResponsiveCardProps) {
  const getColClass = () => {
    switch (cols) {
      case 1: return 'sm:col-span-1'
      case 2: return 'sm:col-span-2 lg:col-span-1'
      case 3: return 'sm:col-span-2 lg:col-span-3 xl:col-span-2'
      case 4: return 'sm:col-span-2 lg:col-span-4'
      case 'full': return 'col-span-full'
      default: return 'sm:col-span-1'
    }
  }

  return (
    <div className={`${getColClass()} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  )
}

interface ResponsiveStatsGridProps {
  children: ReactNode
  className?: string
}

export function ResponsiveStatsGrid({ children, className = '' }: ResponsiveStatsGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {children}
    </div>
  )
}