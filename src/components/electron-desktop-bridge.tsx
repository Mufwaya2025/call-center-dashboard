'use client'

import { useEffect, useState } from 'react'

interface ElectronAPI {
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  showMessageBox: (options: any) => Promise<any>
  saveFileDialog: (options: any) => Promise<any>
  openFileDialog: (options: any) => Promise<any>
  onWindowStateChange: (callback: (state: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export function useElectronAPI() {
  const [isElectron, setIsElectron] = useState(false)
  const [appVersion, setAppVersion] = useState('')
  const [platform, setPlatform] = useState('')
  const [windowState, setWindowState] = useState('')

  useEffect(() => {
    // Check if we're running in Electron
    const checkElectron = () => {
      setIsElectron(typeof window !== 'undefined' && window.electronAPI)
    }

    checkElectron()

    if (typeof window !== 'undefined' && window.electronAPI) {
      // Get app info
      window.electronAPI.getAppVersion().then(setAppVersion)
      window.electronAPI.getPlatform().then(setPlatform)

      // Listen to window state changes
      window.electronAPI.onWindowStateChange(setWindowState)
    }
  }, [])

  const minimizeWindow = async () => {
    if (window.electronAPI) {
      await window.electronAPI.minimizeWindow()
    }
  }

  const maximizeWindow = async () => {
    if (window.electronAPI) {
      await window.electronAPI.maximizeWindow()
    }
  }

  const closeWindow = async () => {
    if (window.electronAPI) {
      await window.electronAPI.closeWindow()
    }
  }

  const showMessageBox = async (options: any) => {
    if (window.electronAPI) {
      return await window.electronAPI.showMessageBox(options)
    }
    return null
  }

  const saveFileDialog = async (options: any) => {
    if (window.electronAPI) {
      return await window.electronAPI.saveFileDialog(options)
    }
    return null
  }

  const openFileDialog = async (options: any) => {
    if (window.electronAPI) {
      return await window.electronAPI.openFileDialog(options)
    }
    return null
  }

  return {
    isElectron,
    appVersion,
    platform,
    windowState,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    showMessageBox,
    saveFileDialog,
    openFileDialog
  }
}

export function ElectronWindowTitleBar() {
  const { isElectron, minimizeWindow, maximizeWindow, closeWindow } = useElectronAPI()

  if (!isElectron) {
    return null
  }

  return (
    <div className="flex items-center justify-between h-8 bg-slate-900 text-white px-4 select-none drag-region">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-medium">Call Center Analytics</span>
      </div>
      <div className="flex items-center space-x-1 no-drag">
        <button
          onClick={minimizeWindow}
          className="w-8 h-6 flex items-center justify-center hover:bg-slate-700 transition-colors"
          title="Minimize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={maximizeWindow}
          className="w-8 h-6 flex items-center justify-center hover:bg-slate-700 transition-colors"
          title="Maximize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button
          onClick={closeWindow}
          className="w-8 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function ElectronAppInfo() {
  const { isElectron, appVersion, platform } = useElectronAPI()

  if (!isElectron) {
    return null
  }

  return (
    <div className="text-xs text-muted-foreground">
      Desktop App v{appVersion} ({platform})
    </div>
  )
}