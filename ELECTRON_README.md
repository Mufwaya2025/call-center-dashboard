# 🖥️ Call Center Analytics Dashboard - Desktop Application

This directory contains the Electron-based desktop version of the Call Center Analytics Dashboard. The desktop application provides the same powerful analytics and monitoring capabilities as the web version, with additional desktop-specific features.

## 🚀 Features

### Desktop-Specific Features
- **Native Window Controls**: Minimize, maximize, and close buttons
- **System Tray Integration**: Quick access to the application
- **Offline Support**: Works without internet connection
- **Native File Dialogs**: Save reports and export data using system dialogs
- **Keyboard Shortcuts**: Native application shortcuts
- **Window State Management**: Remembers window size and position

### Core Features
- **Real-time Call Monitoring**: Live tracking of active calls
- **Advanced Analytics**: Comprehensive dashboards and metrics
- **Agent Performance Tracking**: Individual and team performance
- **Reporting System**: Generate and export reports
- **User Management**: Role-based access control
- **Responsive Design**: Adapts to different screen sizes

## 🛠️ Technology Stack

### Desktop Framework
- **Electron**: Cross-platform desktop application framework
- **Nextron**: Electron + Next.js integration
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Framer Motion**: Animation library
- **Recharts**: Data visualization

### Backend & Data
- **Next.js**: React framework with API routes
- **Prisma**: Database ORM
- **SQLite**: Local database
- **Socket.IO**: Real-time communication

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/call-center-analytics.git
   cd call-center-analytics
   ```

2. **Switch to the Electron branch**
   ```bash
   git checkout electron-desktop-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   npm run electron:postinstall
   ```

4. **Run in development mode**
   ```bash
   npm run electron:dev
   ```

### Production Build

1. **Build the application**
   ```bash
   ./build-electron-app.sh
   ```

2. **The executables will be available in:**
   - **Windows**: `electron-app/dist/win-unpacked/`
   - **macOS**: `electron-app/dist/mac/`
   - **Linux**: `electron-app/dist/linux-unpacked/`

## 🏗️ Project Structure

```
electron-app/
├── main/                 # Electron main process
│   ├── background.js    # Main process entry point
│   ├── preload.js       # Preload script for renderer
│   └── helpers/         # Helper functions
├── renderer/           # Next.js renderer process
│   ├── pages/          # Next.js pages
│   ├── public/         # Static assets
│   └── next.config.js  # Next.js configuration
├── resources/          # App icons and assets
├── package.json        # Electron app dependencies
└── electron-builder.yml # Build configuration

src/
├── components/         # React components
│   ├── electron-desktop-bridge.tsx  # Electron integration
│   └── ui/             # shadcn/ui components
├── app/               # Next.js app directory
└── lib/               # Utility libraries
```

## 🎯 Usage

### Development Mode
```bash
npm run electron:dev
```
This will start the Electron app in development mode with hot reloading.

### Building for Production
```bash
npm run electron:build
```
This will create platform-specific executables in the `dist/` directory.

### Running Tests
```bash
npm test
```

## 🖥️ Platform-Specific Features

### Windows
- **File Associations**: Associate .csv and .xlsx files with the app
- **Taskbar Integration**: Progress indicators and notifications
- **Windows Jump List**: Quick access to recent reports

### macOS
- **Native Menu Bar**: macOS-style menu integration
- **Dock Integration**: App icon in dock with badge notifications
- **Full-Screen Support**: Native macOS full-screen mode
- **Touch Bar Support**: Custom Touch Bar controls

### Linux
- **AppImage**: Portable application format
- **System Tray**: Integration with various Linux desktop environments
- **Native Notifications**: Desktop notification support

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the project root:
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Electron
ELECTRON_IS_DEV=1
```

### Customization
- **App Icon**: Replace `electron-app/resources/icon.png`, `icon.ico`, and `icon.icns`
- **App Name**: Update `productName` in `electron-builder.yml`
- **Window Size**: Modify window dimensions in `main/background.js`
- **Menu Items**: Customize the application menu in `main/background.js`

## 📱 Desktop Integration

### System Tray
The application can be minimized to the system tray for quick access:
- Right-click tray icon for context menu
- Single-click to restore window
- Notifications appear in system tray

### File Operations
The desktop app supports native file operations:
- **Save Reports**: Use system save dialog to export reports
- **Import Data**: Use system open dialog to import CSV/Excel files
- **File Associations**: Open supported file types directly from the app

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Q` | Quit Application |
| `Ctrl/Cmd + W` | Close Window |
| `Ctrl/Cmd + M` | Minimize Window |
| `F11` | Toggle Full Screen |
| `F12` | Toggle Developer Tools |

## 🚀 Deployment

### Manual Deployment
1. Build the application using the build script
2. Distribute the executables from the `dist/` directory
3. Provide installation instructions for each platform

### Auto-Update (Future Enhancement)
The application can be configured to support automatic updates:
- **Windows**: NSIS installer with update support
- **macOS**: Sparkle framework for updates
- **Linux**: AppImage with built-in update checking

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
- Check if all dependencies are installed
- Verify Node.js version (18+ required)
- Check console for error messages

**Build fails**
- Ensure all dependencies are installed
- Check for missing files in electron-app directory
- Verify system requirements for Electron

**Window controls not working**
- Check if preload script is properly loaded
- Verify contextBridge is correctly configured
- Check browser console for errors

### Debugging
- **Development Mode**: Press `F12` to open Developer Tools
- **Main Process**: Use `console.log` in main process files
- **Renderer Process**: Use browser Developer Tools for renderer debugging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the main [README.md](README.md) for general project information
- Review the [documentation](docs/) for detailed guides

---

**Built with ❤️ for desktop call center analytics**