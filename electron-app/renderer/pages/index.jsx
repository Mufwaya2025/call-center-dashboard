import { useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  useEffect(() => {
    // Check if we're running in Electron
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('Running in Electron environment')
      
      // Get app info
      window.electronAPI.getAppVersion().then(version => {
        console.log('App version:', version)
      })
      
      window.electronAPI.getPlatform().then(platform => {
        console.log('Platform:', platform)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Call Center Analytics Dashboard</title>
        <meta name="description" content="Call Center Analytics Dashboard - Desktop Application" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Call Center Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Desktop Application
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Real-time Analytics</h2>
              <p className="text-muted-foreground">
                Monitor call center performance in real-time with comprehensive dashboards and metrics.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Agent Performance</h2>
              <p className="text-muted-foreground">
                Track individual and team performance with detailed analytics and reporting tools.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Advanced Reporting</h2>
              <p className="text-muted-foreground">
                Generate comprehensive reports with customizable filters and export options.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => {
                if (window.electronAPI) {
                  window.electronAPI.showMessageBox({
                    type: 'info',
                    title: 'Welcome',
                    message: 'Welcome to Call Center Analytics Dashboard!',
                    buttons: ['OK']
                  })
                }
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Show Welcome Message
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}