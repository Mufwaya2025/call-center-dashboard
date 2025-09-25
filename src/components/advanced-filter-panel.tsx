'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { CalendarIcon, Search, Filter, X, Clock, Phone, DollarSign, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdvancedFilterState {
  searchTerm: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  timeRange: {
    from: string
    to: string
  }
  agents: string[]
  dispositions: ('ANSWERED' | 'FAILED' | 'NO ANSWER')[]
  trunks: string[]
  callDuration: {
    min: number
    max: number
  }
  revenueRange: {
    min: number
    max: number
  }
  conversionRate: {
    min: number
    max: number
  }
  paymentMethods: string[]
  paymentStatus: ('SUCCESS' | 'FAILED' | 'PENDING')[]
}

interface AdvancedFilterPanelProps {
  filters: AdvancedFilterState
  onFiltersChange: (filters: AdvancedFilterState) => void
  availableAgents: string[]
  availableTrunks: string[]
  availablePaymentMethods: string[]
  onApply: () => void
  onClear: () => void
}

export function AdvancedFilterPanel({
  filters,
  onFiltersChange,
  availableAgents,
  availableTrunks,
  availablePaymentMethods,
  onApply,
  onClear
}: AdvancedFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = useCallback((key: keyof AdvancedFilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }, [filters, onFiltersChange])

  const toggleAgent = useCallback((agent: string) => {
    const newAgents = filters.agents.includes(agent)
      ? filters.agents.filter(a => a !== agent)
      : [...filters.agents, agent]
    updateFilter('agents', newAgents)
  }, [filters.agents, updateFilter])

  const toggleDisposition = useCallback((disposition: 'ANSWERED' | 'FAILED' | 'NO ANSWER') => {
    const newDispositions = filters.dispositions.includes(disposition)
      ? filters.dispositions.filter(d => d !== disposition)
      : [...filters.dispositions, disposition]
    updateFilter('dispositions', newDispositions)
  }, [filters.dispositions, updateFilter])

  const toggleTrunk = useCallback((trunk: string) => {
    const newTrunks = filters.trunks.includes(trunk)
      ? filters.trunks.filter(t => t !== trunk)
      : [...filters.trunks, trunk]
    updateFilter('trunks', newTrunks)
  }, [filters.trunks, updateFilter])

  const togglePaymentMethod = useCallback((method: string) => {
    const newMethods = filters.paymentMethods.includes(method)
      ? filters.paymentMethods.filter(m => m !== method)
      : [...filters.paymentMethods, method]
    updateFilter('paymentMethods', newMethods)
  }, [filters.paymentMethods, updateFilter])

  const togglePaymentStatus = useCallback((status: 'SUCCESS' | 'FAILED' | 'PENDING') => {
    const newStatuses = filters.paymentStatus.includes(status)
      ? filters.paymentStatus.filter(s => s !== status)
      : [...filters.paymentStatus, status]
    updateFilter('paymentStatus', newStatuses)
  }, [filters.paymentStatus, updateFilter])

  const hasActiveFilters = () => {
    return filters.searchTerm ||
           filters.dateRange.from ||
           filters.dateRange.to ||
           filters.agents.length > 0 ||
           filters.dispositions.length > 0 ||
           filters.trunks.length > 0 ||
           filters.paymentMethods.length > 0 ||
           filters.paymentStatus.length > 0
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.agents.length > 0) count++
    if (filters.dispositions.length > 0) count++
    if (filters.trunks.length > 0) count++
    if (filters.paymentMethods.length > 0) count++
    if (filters.paymentStatus.length > 0) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Advanced Filters</CardTitle>
            {hasActiveFilters() && (
              <Badge variant="secondary">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button onClick={onApply}>
              <Search className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
        <CardDescription>
          Filter calls and payments by multiple criteria
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Search Term */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client number, agent, trunk..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Time</label>
              <Input
                type="time"
                value={filters.timeRange.from}
                onChange={(e) => updateFilter('timeRange', { ...filters.timeRange, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Time</label>
              <Input
                type="time"
                value={filters.timeRange.to}
                onChange={(e) => updateFilter('timeRange', { ...filters.timeRange, to: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Agents */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agents
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableAgents.map((agent) => (
                <div key={agent} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agent-${agent}`}
                    checked={filters.agents.includes(agent)}
                    onCheckedChange={() => toggleAgent(agent)}
                  />
                  <label htmlFor={`agent-${agent}`} className="text-sm">
                    {agent}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Dispositions */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Dispositions
            </label>
            <div className="flex flex-wrap gap-2">
              {(['ANSWERED', 'FAILED', 'NO ANSWER'] as const).map((disposition) => (
                <Badge
                  key={disposition}
                  variant={filters.dispositions.includes(disposition) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleDisposition(disposition)}
                >
                  {disposition}
                </Badge>
              ))}
            </div>
          </div>

          {/* Trunks */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trunks</label>
            <div className="flex flex-wrap gap-2">
              {availableTrunks.map((trunk) => (
                <Badge
                  key={trunk}
                  variant={filters.trunks.includes(trunk) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTrunk(trunk)}
                >
                  {trunk}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Call Duration Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Call Duration (seconds)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.callDuration.min}
                onChange={(e) => updateFilter('callDuration', { ...filters.callDuration, min: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.callDuration.max}
                onChange={(e) => updateFilter('callDuration', { ...filters.callDuration, max: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Revenue Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Range ($)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.revenueRange.min}
                onChange={(e) => updateFilter('revenueRange', { ...filters.revenueRange, min: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.revenueRange.max}
                onChange={(e) => updateFilter('revenueRange', { ...filters.revenueRange, max: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Methods</label>
            <div className="flex flex-wrap gap-2">
              {availablePaymentMethods.map((method) => (
                <Badge
                  key={method}
                  variant={filters.paymentMethods.includes(method) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePaymentMethod(method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Status</label>
            <div className="flex flex-wrap gap-2">
              {(['SUCCESS', 'FAILED', 'PENDING'] as const).map((status) => (
                <Badge
                  key={status}
                  variant={filters.paymentStatus.includes(status) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePaymentStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}