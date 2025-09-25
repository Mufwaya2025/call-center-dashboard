module.exports = {
  // The source folder of your application
  srcDir: 'src',
  
  // The output folder of your application
  outDir: 'app',
  
  // The main process source folder
  mainSrcDir: 'electron-app/main',
  
  // The renderer source folder
  rendererSrcDir: 'electron-app/renderer',
  
  // The development server port
  port: 8888,
  
  // The Electron debug port
  debugPort: 5858,
  
  // The Electron app title
  title: 'Call Center Analytics Dashboard',
  
  // The Electron app icon
  icon: 'electron-app/resources/icon.png',
  
  // The Electron app loading screen
  loading: {
    text: 'Loading Call Center Analytics...',
    color: '#ffffff',
    backgroundColor: '#1e293b',
  },
  
  // The Electron app window options
  window: {
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    center: true,
    title: 'Call Center Analytics Dashboard',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
  },
  
  // The Electron app menu
  menu: {
    role: 'editMenu',
  },
  
  // The Electron app tray
  tray: {
    enabled: false,
  },
  
  // The Electron app auto updater
  updater: {
    enabled: false,
  },
  
  // The Electron app builder options
  builder: {
    appId: 'com.callcenter.analytics',
    productName: 'Call Center Analytics Dashboard',
    copyright: 'Copyright © 2025 Call Center Analytics',
    directories: {
      output: 'dist',
      buildResources: 'electron-app/resources',
    },
    files: [
      'app/**/*',
      'node_modules/**/*',
      'package.json',
    ],
    mac: {
      category: 'public.app-category.business',
      target: ['dmg', 'zip'],
    },
    win: {
      target: ['nsis', 'portable'],
    },
    linux: {
      target: ['AppImage'],
      category: 'Utility',
    },
  },
  
  // The Electron app development options
  development: {
    type: 'browser',
    url: 'http://localhost:8888',
  },
  
  // The Electron app production options
  production: {
    type: 'file',
    url: 'app://./',
  },
  
  // The Electron app preload script
  preload: 'electron-app/main/preload.js',
  
  // The Electron app main process
  main: 'electron-app/main/background.js',
  
  // The Electron app renderer process
  renderer: 'electron-app/renderer',
  
  // The Electron app resources
  resources: 'electron-app/resources',
  
  // The Electron app build options
  build: {
    assetsDir: 'public',
    generateBuildId: true,
    generateSourceMap: false,
  },
  
  // The Electron app environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  
  // The Electron app plugins
  plugins: [],
  
  // The Electron app webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add custom webpack configuration here
    return config
  },
  
  // The Electron app babel configuration
  babel: (config) => {
    // Add custom babel configuration here
    return config
  },
  
  // The Electron app postcss configuration
  postcss: (config) => {
    // Add custom postcss configuration here
    return config
  },
}