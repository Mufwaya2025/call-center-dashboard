# 📞 Call Center Analytics Dashboard

A comprehensive call center analytics dashboard built with Next.js 15, featuring agent performance monitoring, payment conversion tracking, and interactive data visualizations.

## ✨ Features

### 🎯 Core Dashboard Features
- **Multi-tab Interface**: Organized dashboard with dedicated sections for different analytics
- **Real-time Analytics**: Live monitoring of call center metrics and performance indicators
- **Interactive Charts**: Dynamic data visualizations using Recharts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 👥 Agent Performance Monitoring
- **Call Volume Tracking**: Monitor number of calls per agent
- **Talk Time Analysis**: Track average and total talk time
- **Success Rate Metrics**: Calculate call success and conversion rates
- **Performance Comparison**: Compare agent performance side-by-side
- **Time-based Filtering**: Analyze performance by date ranges and time periods

### 💰 Payment Conversion Tracking
- **Conversion Rate Analysis**: Track payment success rates over time
- **Revenue Monitoring**: Monitor total revenue and payment trends
- **Payment Method Analysis**: Break down conversions by payment method
- **Customer Insights**: Analyze customer payment behavior patterns
- **Real-time Updates**: Live payment conversion metrics

### 📊 Data Visualization
- **Time Series Charts**: Track metrics over time with interactive charts
- **Bar Charts**: Compare performance across different categories
- **Pie Charts**: Visualize distribution and percentages
- **Heat Maps**: Identify patterns and trends in call data
- **Customizable Filters**: Drill down into specific data segments

### 🔄 Flexible Data Import
- **CSV Upload Support**: Import call logs and payment data from CSV files
- **Column Mapping System**: Flexible mapping for different CSV formats
- **Automatic Field Detection**: Smart detection of CSV column headers
- **Preview Functionality**: Preview data before importing
- **Validation**: Ensure data integrity during import

### 📤 Data Export
- **Multiple Formats**: Export data in CSV, JSON, and Excel formats
- **Customizable Exports**: Select specific data ranges and filters
- **Scheduled Reports**: Automated report generation and export
- **Real-time Export**: Export current dashboard views and data

## 🛠 Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe JavaScript development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### UI Components & Styling
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations and interactions

### Data & Visualization
- **📊 Recharts** - Composable charting library
- **🗄️ Prisma** - Next-generation ORM for database management
- **🔄 Zustand** - Simple state management solution
- **📈 TanStack Query** - Powerful data synchronization

### Database & Backend
- **🗄️ SQLite** - Lightweight, serverless database
- **🔧 Prisma Client** - Type-safe database access
- **⚡ Next.js API Routes** - Backend API endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/call-center-dashboard.git
   cd call-center-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
call-center-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── layout.tsx         # App layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── agent-performance-tracker.tsx
│   │   ├── payment-conversion-tracker.tsx
│   │   ├── call-analytics-charts.tsx
│   │   ├── call-details-table.tsx
│   │   ├── export-panel.tsx
│   │   ├── filter-panel.tsx
│   │   ├── column-mapper.tsx
│   │   └── payment-column-mapper.tsx
│   ├── lib/                  # Utility functions
│   │   ├── db.ts             # Database connection
│   │   ├── utils.ts          # Helper functions
│   │   └── socket.ts         # WebSocket setup
│   └── hooks/                # Custom React hooks
│       ├── use-mobile.ts     # Mobile detection hook
│       └── use-toast.ts      # Toast notification hook
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
│   ├── favicon.ico
│   └── logo.svg
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🗄️ Database Schema

The application uses two main database tables:

### Call Logs
- Stores call records with details like caller/callee numbers, timestamps, call duration, and disposition
- Tracks agent performance metrics and call outcomes

### Payment Data
- Stores payment information including amounts, dates, status, and payment methods
- Enables payment conversion analysis and revenue tracking

## 📊 Data Import Guide

### Supported Formats
- **Call Logs**: CSV files with columns for caller number, callee number, timestamps, call duration, etc.
- **Payment Data**: CSV files with client numbers, amounts, payment dates, and status

### Column Mapping
The flexible column mapping system supports:
- Automatic field detection based on column names
- Manual mapping configuration for custom formats
- Preview functionality to verify mapping before import
- Support for various PBX and payment processor export formats

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Customization
- **Theme**: Modify `tailwind.config.ts` for custom styling
- **Components**: Extend shadcn/ui components in `src/components/ui/`
- **API**: Add custom endpoints in `src/app/api/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Database management with [Prisma](https://prisma.io/)

---

## 📞 Support

For support, questions, or feature requests:
1. Check the [Issues](https://github.com/YOUR_USERNAME/call-center-dashboard/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ for call center analytics and optimization.