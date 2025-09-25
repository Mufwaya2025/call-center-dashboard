'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Settings, Save, RotateCcw, Eye, EyeOff } from 'lucide-react'

interface ColumnMapping {
  [key: string]: string
}

interface PaymentColumnMapperProps {
  columns: string[]
  requiredFields: string[]
  onMappingChange: (mapping: ColumnMapping) => void
  onClose: () => void
  initialMapping?: ColumnMapping
}

const paymentFieldLabels: { [key: string]: string } = {
  id: 'Payment ID',
  clientNumber: 'Client Number',
  amount: 'Amount',
  paymentDate: 'Payment Date',
  paymentMethod: 'Payment Method',
  status: 'Status',
  reference: 'Reference'
}

export function PaymentColumnMapper({ 
  columns, 
  requiredFields, 
  onMappingChange, 
  onClose, 
  initialMapping = {} 
}: PaymentColumnMapperProps) {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping)
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFieldMapping = (field: string, column: string) => {
    const newMapping = { ...mapping, [field]: column }
    setMapping(newMapping)
  }

  const handleAutoMap = () => {
    const autoMapping: ColumnMapping = {}
    
    Object.keys(paymentFieldLabels).forEach(field => {
      const label = paymentFieldLabels[field].toLowerCase()
      const matchingColumn = columns.find(col => 
        col.toLowerCase().includes(label) || 
        label.includes(col.toLowerCase())
      )
      if (matchingColumn) {
        autoMapping[field] = matchingColumn
      }
    })
    
    setMapping(autoMapping)
  }

  const handleSave = () => {
    onMappingChange(mapping)
    onClose()
  }

  const getMappedPreview = () => {
    if (!showPreview || previewData.length === 0) return []
    
    return previewData.slice(0, 5).map((row, rowIndex) => {
      const mappedRow: { [key: string]: string } = {}
      Object.entries(mapping).forEach(([field, columnIndex]) => {
        const colIndex = parseInt(columnIndex)
        mappedRow[field] = row[colIndex] || ''
      })
      return mappedRow
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Payment Data Column Mapping</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleAutoMap}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Auto Map
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Mapping
              </Button>
            </div>
          </div>
          <CardDescription>
            Map your payment CSV columns to the required fields. Required fields are marked with *.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Columns Preview */}
          <div>
            <h3 className="text-lg font-medium mb-3">Detected Columns ({columns.length})</h3>
            <div className="flex flex-wrap gap-2">
              {columns.map((col, index) => (
                <Badge key={index} variant="outline">
                  {col}
                </Badge>
              ))}
            </div>
          </div>

          {/* Column Mapping Table */}
          <div>
            <h3 className="text-lg font-medium mb-3">Field Mapping</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Field Name</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Map to Column</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(paymentFieldLabels).map(([field, label]) => (
                  <TableRow key={field}>
                    <TableCell className="font-medium">
                      {label}
                      {requiredFields.includes(field) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {requiredFields.includes(field) ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={mapping[field] || ''} 
                        onValueChange={(value) => handleFieldMapping(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column..." />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {mapping[field] && previewData.length > 0 && (
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {previewData[0]?.[parseInt(mapping[field])] || 'N/A'}
                        </code>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Data Preview */}
          {showPreview && (
            <div>
              <h3 className="text-lg font-medium mb-3">Data Preview</h3>
              <div className="space-y-4">
                {/* Raw Data Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Raw Data (First 5 rows)</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {columns.map((col, index) => (
                            <TableHead key={index} className="text-xs">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 5).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex} className="text-xs">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Mapped Data Preview */}
                {Object.keys(mapping).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Mapped Data Preview</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.entries(mapping).map(([field, colIndex]) => (
                              <TableHead key={field} className="text-xs">
                                {paymentFieldLabels[field]}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getMappedPreview().map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.entries(mapping).map(([field, colIndex]) => (
                                <TableCell key={field} className="text-xs">
                                  {row[field] || 'N/A'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sample Data Upload for Preview */}
          <div>
            <h3 className="text-lg font-medium mb-3">Upload Sample for Preview</h3>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".csv,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const text = event.target?.result as string
                      const lines = text.split('\n').filter(line => line.trim())
                      const sampleData = lines.slice(0, 6).map(line => 
                        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
                      )
                      setPreviewData(sampleData)
                    }
                    reader.readAsText(file)
                  }
                }}
                placeholder="Upload a sample CSV file for preview..."
              />
              <p className="text-sm text-muted-foreground">
                Upload a sample of your payment CSV file to see how the mapping will work with your data.
              </p>
            </div>
          </div>

          {/* Mapping Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Mapping Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Required Fields Mapped: </span>
                {requiredFields.filter(field => mapping[field]).length} / {requiredFields.length}
              </div>
              <div>
                <span className="font-medium">Total Fields Mapped: </span>
                {Object.keys(mapping).length} / {Object.keys(paymentFieldLabels).length}
              </div>
            </div>
            {requiredFields.some(field => !mapping[field]) && (
              <p className="text-red-600 text-sm mt-2">
                Warning: Some required fields are not mapped. Please map all required fields before saving.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}