import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Dialogs
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  
  // Window state events
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', (_event, state) => callback(state))
  },
  
  // Legacy IPC support
  send: (channel, value) => ipcRenderer.send(channel, value),
  on: (channel, callback) => {
    const subscription = (_event, ...args) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Legacy support
contextBridge.exposeInMainWorld('ipc', {
  send: electronAPI.send,
  on: electronAPI.on
})
