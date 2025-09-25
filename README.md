# 📞 Call Center Analytics Dashboard

A comprehensive, enterprise-grade call center analytics dashboard built with Next.js 15, TypeScript, and modern web technologies. This project provides real-time monitoring, advanced analytics, and comprehensive reporting capabilities for call center operations.

## 🚀 Features

### Core Analytics
- **Real-time Call Monitoring**: Live tracking of active calls with WebSocket integration
- **Advanced Filtering**: Multi-dimensional filtering by date, time, agent, call status, and more
- **Performance Metrics**: Comprehensive KPIs including call duration, success rates, and agent performance
- **Visual Analytics**: Interactive charts and graphs for data visualization

### Reporting & Export
- **Multiple Report Types**: Daily, weekly, monthly, and custom reports
- **Export Formats**: PDF, Excel, and CSV export capabilities
- **Scheduled Reports**: Automated report generation and delivery
- **Custom Templates**: Branded report templates with company logos

### User Management
- **Role-Based Access Control**: 5 distinct user roles with granular permissions
- **Authentication System**: Secure login with session management
- **User Profiles**: Individual user settings and preferences
- **Audit Trail**: Complete activity logging and compliance tracking

### Real-time Features
- **Live Call Stream**: Real-time updates on call status and metrics
- **Agent Performance**: Live monitoring of agent activity and performance
- **Alert System**: Customizable alerts for critical metrics and events
- **Dashboard Updates**: Real-time dashboard refresh without page reload

### Performance & Optimization
- **Data Processing Pipeline**: Automated data validation and processing
- **Caching System**: Intelligent caching for improved performance
- **Lazy Loading**: Optimized component loading for better UX
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Desktop Application
- **Cross-Platform Desktop App**: Native executable for Windows, macOS, and Linux
- **Electron Integration**: Built with Electron + Next.js using Nextron
- **Native Features**: Custom title bar, file dialogs, window controls
- **Offline Support**: Works without internet connection
- **System Integration**: Native menus, keyboard shortcuts, system tray

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript 5**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Framer Motion**: Animation library
- **Recharts**: Data visualization charts
- **Zustand**: State management
- **TanStack Query**: Server state management

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database ORM with SQLite
- **WebSocket**: Real-time communication
- **Z-AI Web Dev SDK**: AI-powered features
- **NextAuth.js**: Authentication framework

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Commitlint**: Commit message validation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/call-center-analytics.git
   cd call-center-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── auth/             # Authentication components
│   └── charts/           # Chart components
├── lib/                  # Utility libraries
│   ├── db/               # Database configuration
│   ├── auth/             # Authentication utilities
│   ├── utils/            # General utilities
│   └── socket.ts         # WebSocket configuration
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── store/                # Zustand store
└── constants/            # Application constants
```

## 👥 User Roles

The system supports 5 distinct user roles with different permissions:

### 1. Administrator
- Full system access
- User management
- System configuration
- All analytics and reports

### 2. Manager
- Team performance oversight
- Report generation and export
- User management (limited)
- Full analytics access

### 3. Supervisor
- Real-time monitoring
- Agent performance tracking
- Basic reporting
- Team management

### 4. Agent
- Personal performance metrics
- Call history access
- Basic analytics
- Limited reporting

### 5. Analyst
- Advanced analytics access
- Report generation
- Data export
- No user management

## 📊 Data Schema

### Call Records
- **Basic Information**: Caller ID, callee number, timestamp
- **Call Details**: Duration, disposition, trunk information
- **Agent Information**: Agent ID, extension, session data
- **Performance Metrics**: Talk time, wait time, success rate

### User Management
- **User Profiles**: Name, email, role, department
- **Permissions**: Role-based access control
- **Activity Logs**: Login history, actions performed
- **Settings**: User preferences and configurations

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# WebSocket
WS_URL="ws://localhost:3000"

# AI Features (Optional)
ZAI_API_KEY="your-zai-api-key"
```

### Customization
- **Branding**: Update company logo and colors in `src/constants/branding.ts`
- **Reports**: Customize report templates in `src/components/reports/templates/`
- **Charts**: Configure chart options in `src/components/charts/config/`
- **Permissions**: Modify role permissions in `src/lib/auth/roles.ts`

## 📈 Usage

### Dashboard Navigation
1. **Login**: Authenticate with your credentials
2. **Dashboard**: View main analytics dashboard
3. **Reports**: Access and generate reports
4. **Monitoring**: View real-time call data
5. **Settings**: Configure user preferences

### Generating Reports
1. Navigate to the Reports section
2. Select report type (Daily, Weekly, Monthly, Custom)
3. Set date range and filters
4. Choose export format (PDF, Excel, CSV)
5. Click "Generate Report"

### Real-time Monitoring
1. Go to the Monitoring tab
2. View live call statistics
3. Filter by agent, status, or time range
4. Set up alerts for critical metrics

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Docker
```bash
# Build the image
docker build -t call-center-analytics .

# Run the container
docker run -p 3000:3000 call-center-analytics
```

### Traditional Server
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Desktop Application
For the desktop version, switch to the `electron-desktop-app` branch:

```bash
# Switch to desktop branch
git checkout electron-desktop-app

# Install dependencies
npm install
npm run electron:postinstall

# Run in development mode
npm run electron:dev

# Build executable
npm run electron:build
```

The desktop application creates native executables for:
- **Windows**: .exe files
- **macOS**: .app and .dmg files  
- **Linux**: .AppImage files

See [ELECTRON_README.md](ELECTRON_README.md) for detailed desktop app documentation.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write TypeScript types for all new code
- Include tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the excellent framework
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Prisma** - For the modern database toolkit

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Join our community discussions

---

**Built with ❤️ for call center analytics and monitoring**