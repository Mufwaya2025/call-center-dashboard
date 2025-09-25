# Call Center Dashboard Project

## How to Extract and Run

### 1. Extract the Archive
```bash
# Extract the tar.gz file
tar -xzf call-center-dashboard.tar.gz

# Or if you have zip support:
# unzip call-center-dashboard.zip
```

### 2. Install Dependencies
```bash
# Navigate to the project directory
cd call-center-dashboard

# Install Node.js dependencies
npm install
```

### 3. Set Up Database
```bash
# Push the Prisma schema to the database
npm run db:push
```

### 4. Run the Development Server
```bash
# Start the development server
npm run dev
```

### 5. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## Project Features

This is a comprehensive call center analytics dashboard with the following features:

- **Agent Performance Monitoring**: Track call metrics, talk time, and success rates
- **Payment Conversion Tracking**: Monitor payment success rates and conversion metrics
- **Interactive Charts**: Visual representation of call and payment data
- **Data Export**: Export filtered data in various formats
- **Flexible Column Mapping**: Support for different CSV formats from various PBX systems
- **Real-time Analysis**: Process and analyze call logs and payment data

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts for data visualization
- **State Management**: Zustand and React Query

## File Structure

- `src/app/`: Next.js app router pages and layouts
- `src/components/`: React components including UI components and custom components
- `src/lib/`: Utility functions and database configuration
- `src/hooks/`: Custom React hooks
- `prisma/`: Database schema and configuration
- `public/`: Static assets

## Notes

- The project includes sample data for testing
- Column mapping feature allows flexible CSV import from different systems
- All components are responsive and work on mobile devices
- The dashboard supports both light and dark themes

## Support

If you encounter any issues during setup or have questions about the project, please refer to the main README.md file included in the project.