'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Filter, X, Search, Phone, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  agents: string[]
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  dateRange: { from: Date; to: Date } | null
  agents: string[]
  dispositions: string[]
  callTypes: string[]
  trunkNames: string[]
  minTalkTime: number | null
  maxTalkTime: number | null
  minAmount: number | null
  maxAmount: number | null
  searchQuery: string
}

const defaultFilters: FilterState = {
  dateRange: null,
  agents: [],
  dispositions: [],
  callTypes: [],
  trunkNames: [],
  minTalkTime: null,
  maxTalkTime: null,
  minAmount: null,
  maxAmount: null,
  searchQuery: ''
}

export function FilterPanel({ agents, onFiltersChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const addAgent = (agent: string) => {
    if (!filters.agents.includes(agent)) {
      updateFilter('agents', [...filters.agents, agent])
    }
  }

  const removeAgent = (agent: string) => {
    updateFilter('agents', filters.agents.filter(a => a !== agent))
  }

  const addDisposition = (disposition: string) => {
    if (!filters.dispositions.includes(disposition)) {
      updateFilter('dispositions', [...filters.dispositions, disposition])
    }
  }

  const removeDisposition = (disposition: string) => {
    updateFilter('dispositions', filters.dispositions.filter(d => d !== disposition))
  }

  const clearAllFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterState]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'number') return value !== null
    if (typeof value === 'string') return value !== ''
    if (value && typeof value === 'object') return value.from !== null || value.to !== null
    return false
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary">Active</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client number, agent ID, or reference..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={{
                  from: filters.dateRange?.from,
                  to: filters.dateRange?.to,
                }}
                onSelect={(range) => {
                  updateFilter('dateRange', range ? { from: range.from!, to: range.to! } : null)
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {isExpanded && (
          <>
            {/* Agents Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Agents</label>
              <Select onValueChange={addAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agents..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(agent => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {filters.agents.map(agent => (
                  <Badge key={agent} variant="secondary" className="flex items-center gap-1">
                    {agent}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeAgent(agent)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dispositions Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Call Disposition</label>
              <Select onValueChange={addDisposition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispositions..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANSWERED">Answered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="NO ANSWER">No Answer</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {filters.dispositions.map(disposition => (
                  <Badge key={disposition} variant="secondary" className="flex items-center gap-1">
                    {disposition}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeDisposition(disposition)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Talk Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Talk Time (seconds)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minTalkTime || ''}
                  onChange={(e) => updateFilter('minTalkTime', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Talk Time (seconds)</label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.maxTalkTime || ''}
                  onChange={(e) => updateFilter('maxTalkTime', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Amount ($)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount || ''}
                  onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Amount ($)</label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.maxAmount || ''}
                  onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}