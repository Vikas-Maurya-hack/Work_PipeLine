# Work Pipeline - Lead Management System

A comprehensive lead management system built with modern web technologies, featuring data visualization, Excel integration, and an intuitive pipeline board interface.

## Features

- 📊 Interactive Dashboard with Visualizations
- 📈 Performance Graphs and Pie Charts
- 📋 Kanban-style Pipeline Board
- 📁 Excel Data Integration
- 🔄 Automatic Data Backup System
- ✨ Modern UI with shadcn/ui Components

## Technologies Used

- React + TypeScript
- Vite for Build Tooling
- Tailwind CSS for Styling
- shadcn/ui for UI Components
- XLSX for Excel Integration
- Recharts for Data Visualization

## Data Storage

The application uses a fixed Excel file system for data persistence:

### File Locations
- **Main Database**: 
  - Windows: `%APPDATA%\work-pipeline\leads_database.xlsx`
  - macOS: `~/Library/Preferences/work-pipeline/leads_database.xlsx`
  - Linux: `~/.local/share/work-pipeline/leads_database.xlsx`

### Backup System
- Automatic backups are created daily
- Backup Location: `[APP_DATA_PATH]/work-pipeline/backups/`
- Format: `leads-YYYY-MM-DD.xlsx`

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/Vikas-Maurya-hack/Work_PipeLine.git
   ```

2. Install dependencies:
   ```sh
   cd Work_PipeLine
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

```
work-pipeline/
├── src/
│   ├── components/        # UI Components
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── PipelineBoard.tsx
│   │   └── ui/           # shadcn/ui components
│   ├── lib/
│   │   ├── excel.ts      # Excel integration
│   │   └── utils.ts      # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
└── public/              # Static assets
```

## Data Management

### Excel Integration
- Automatic saving to fixed location
- Daily backups
- Data validation on import/export
- Template generation for new data

### Required Data Fields
- ID (string)
- Title (string)
- Client (string)
- Value (number)
- Date (date)
- Status (enum: new, contacted, qualified, proposal, won)
- Priority (enum: high, medium, low)
- Description (string, optional)
- Email (string, optional)
- Phone (string, optional)
- Created At (date)
- Updated At (date)

## Development

### Running Locally

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start development server:
   ```sh
   npm run dev
   ```

3. Build for production:
   ```sh
   npm run build
   ```

### Updating GitHub Repository

1. Stage your changes:
   ```sh
   git add .
   ```

2. Commit changes:
   ```sh
   git commit -m "Your commit message"
   ```

3. Push to GitHub:
   ```sh
   git push origin master
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
