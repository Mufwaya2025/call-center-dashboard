import path from 'path'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
      { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'Toggle Full Screen', accelerator: 'F11', role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
      { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: () => {
          // Show about dialog
        }
      }
    ]
  }
]

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../resources/icon.png'),
    show: false
  })

  // Set application menu
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (isProd) {
    await mainWindow.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}`)
    mainWindow.webContents.openDevTools()
  }

  // Handle window state
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-changed', 'maximized')
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-changed', 'unmaximized')
  })

  mainWindow.on('minimize', () => {
    mainWindow.webContents.send('window-state-changed', 'minimized')
  })

  mainWindow.on('restore', () => {
    mainWindow.webContents.send('window-state-changed', 'restored')
  })
})()

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow('main', {
      width: 1400,
      height: 900,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    })
  }
})

// IPC handlers for desktop-specific functionality
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform', () => {
  return process.platform
})

ipcMain.handle('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.minimize()
})

ipcMain.handle('maximize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})

ipcMain.handle('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.close()
})

ipcMain.handle('show-message-box', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    const { dialog } = require('electron')
    return await dialog.showMessageBox(win, options)
  }
  return null
})

ipcMain.handle('save-file-dialog', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    const { dialog } = require('electron')
    return await dialog.showSaveDialog(win, options)
  }
  return null
})

ipcMain.handle('open-file-dialog', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    const { dialog } = require('electron')
    return await dialog.showOpenDialog(win, options)
  }
  return null
})
