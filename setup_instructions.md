# Call Center Dashboard - Manual Setup Guide

Since direct downloads aren't working, here's how to recreate the project locally:

## Option 1: Use the New Archive
Try downloading: `http://21.0.6.133:9000/project-clean.tar.gz`

## Option 2: Manual Recreation (Step-by-Step)

### Step 1: Create Project Structure
```bash
mkdir call-center-dashboard
cd call-center-dashboard
```

### Step 2: Initialize Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Step 3: Install Required Dependencies
```bash
npm install recharts zustand @tanstack/react-query lucide-react date-fns
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-badge @radix-ui/react-button @radix-ui/react-calendar @radix-ui/react-card @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-sheet @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
npm install prisma @prisma/client
npm install class-variance-authority clsx tailwind-merge
```

### Step 4: Create Database Schema
Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model CallLog {
  id                String   @id @default(cuid())
  accountCode       String?
  callerNumber      String
  calleeNumber      String
  context           String?
  callerIdNumber    String?
  sourceChannel     String?
  destChannel       String?
  lastApp           String?
  lastData          String?
  startTime         DateTime
  answerTime        DateTime?
  endTime           DateTime?
  callTime          Int
  talkTime          Int
  disposition       String
  amaFlags          String?
  uniqueId          String
  logUserfield      String?
  destChannelExt    String?
  callerName        String?
  answeredBy        String?
  session           String?
  premierCaller     String?
  actionType        String?
  sourceTrunkName   String?
  destTrunkName     String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("call_logs")
}

model PaymentData {
  id            String   @id @default(cuid())
  clientNumber  String
  amount        Float
  paymentDate   DateTime
  status        String
  paymentMethod String?
  reference     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("payment_data")
}
```

### Step 5: Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### Step 6: Create Main Application Files

#### Create `src/app/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AgentPerformanceTracker } from '@/components/agent-performance-tracker'
import { PaymentConversionTracker } from '@/components/payment-conversion-tracker'
import { CallAnalyticsCharts } from '@/components/call-analytics-charts'
import { CallDetailsTable } from '@/components/call-details-table'
import { ExportPanel } from '@/components/export-panel'

export default function Home() {
  const [activeTab, setActiveTab] = useState('performance')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Call Center Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor agent performance and track payment conversions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Agent Performance</TabsTrigger>
          <TabsTrigger value="conversion">Payment Conversion</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="details">Call Details</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>
                Track call volume, talk time, and success rates by agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgentPerformanceTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Conversion Tracking</CardTitle>
              <CardDescription>
                Monitor payment success rates and conversion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentConversionTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Analytics</CardTitle>
              <CardDescription>
                Visual representations of call data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CallAnalyticsCharts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Details</CardTitle>
              <CardDescription>
                Detailed view of individual call records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CallDetailsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export filtered data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Step 7: Continue with the Rest of the Components
[Continue with all the other components...]

## Option 3: Email Transfer
If you provide me with your email address, I can try to send the project files as attachments.

## Option 4: Cloud Storage Access
If you can provide me with access to your Google Drive, Dropbox, or other cloud storage, I can upload the files directly.

## Option 5: SSH/SFTP Access
If you have SSH access to this server, you can copy the files directly:
```bash
scp username@21.0.6.133:/home/z/my-project/project-clean.tar.gz .
```

## Next Steps
Please let me know which option works best for you, or if you need me to provide the complete step-by-step manual setup instructions.