# Work Pipeline - Lead Management System 🚀

A powerful **Electron Desktop Application** for managing sales leads with automatic Excel file storage, real-time data visualization, and an intuitive drag-and-drop pipeline interface.

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)

## ✨ Features

### 🎯 Lead Management
- **Drag & Drop Pipeline Board** - Visual Kanban-style board with 5 stages (New, Contacted, Qualified, Proposal, Won)
- **Create, Edit & Delete Leads** - Full CRUD operations with form validation
- **Advanced Search** - Multi-field search across title, client, email, description, and phone
- **Smart Filtering** - Real-time search with highlighted matches

### 📊 Data Visualization
- **Interactive Pie Chart** - Lead distribution by status with distinct colors
- **Monthly Performance Graph** - Bar & line charts showing leads, value, and conversion rate
- **Dashboard Metrics** - Total leads, in-progress, completed, and pipeline value

### 💾 Data Storage & Excel Integration
- **Automatic Excel Saving** - Data saved to local disk in Excel format
- **File Location**: `C:\Users\[USERNAME]\Documents\WorkPipeline\leads_database.xlsx`
- **Auto Backup System** - Daily backups in `Documents\WorkPipeline\backups\`
- **Import/Export** - Import existing Excel files and export for sharing

### 💰 Indian Business Format
- **Currency**: ₹ (Indian Rupees)
- **Smart Formatting**: Automatically displays as Cr (Crores) and L (Lakhs)
  - ₹5,00,00,000 → ₹5.00 Cr
  - ₹2,50,000 → ₹2.50 L
- **Time Format**: 12-hour with AM/PM (05 Nov 2025, 06:30:45 PM)

### 🔒 Data Security
- **Local Storage Only** - No cloud, no servers, complete privacy
- **Automatic Backups** - Daily backup files with date stamps
- **Validation** - Phone number and email validation

## 🛠️ Technologies Used

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript** - Type safety
- **Vite 5.4.19** - Build tool & dev server
- **Tailwind CSS** - Styling

### Desktop App
- **Electron 28.3.3** - Cross-platform desktop app framework
- **electron-builder** - Installer creation

### Data & Visualization
- **XLSX** - Excel file handling
- **Recharts** - Charts and graphs
- **file-saver** - File download functionality

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **shadcn/ui** - Pre-built components

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Windows OS** (for Electron app)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vikas-Maurya-hack/Work_PipeLine.git
   cd Work_PipeLine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Desktop App**:
   
   **Option A - Double-click the batch file**:
   ```
   Start Desktop App.bat
   ```
   
   **Option B - Command line**:
   ```bash
   npm run electron:dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm run electron:build:win
   ```

## 📁 Project Structure

```
work-pipeline/
├── electron/
│   ├── main.cjs              # Electron main process
│   └── preload.cjs           # Preload script for IPC
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx     # Dashboard with metrics
│   │   ├── Header.tsx        # Top navigation & search
│   │   ├── LeadCard.tsx      # Individual lead card
│   │   ├── LeadDialog.tsx    # Add/Edit form
│   │   ├── LeadsPieChart.tsx # Pie chart visualization
│   │   ├── MonthlyGraph.tsx  # Performance graph
│   │   ├── PipelineBoard.tsx # Kanban board
│   │   └── ui/              # Reusable UI components
│   ├── hooks/
│   │   └── useLeads.ts      # Lead management logic
│   ├── lib/
│   │   ├── excel.ts         # Excel import/export
│   │   ├── storage.ts       # Data persistence
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main page
│   │   └── NotFound.tsx     # 404 page
│   └── types/
│       └── lead.ts          # TypeScript types
├── public/
│   ├── bg.jpg               # Background image
│   └── robots.txt
├── Start Desktop App.bat     # Windows launcher
├── package.json
└── README.md
```

## 📊 Data Structure

### Lead Object
```typescript
{
  id: string,              // Unique identifier
  title: string,           // Project/Lead title
  client: string,          // Client name
  value: number,           // Deal value in ₹
  date: string,            // Date & time (ISO format)
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won',
  priority: 'high' | 'medium' | 'low',
  description?: string,    // Optional description
  email?: string,          // Optional email
  phone: string,           // Required phone number
  createdAt: string,       // Creation timestamp
  updatedAt: string        // Last update timestamp
}
```

## 🎨 UI Features

### Form Validation
- ✅ Required fields marked with asterisk (*)
- ✅ Phone number validation (10-15 digits, +91 format supported)
- ✅ Email validation (proper format check)
- ✅ Date & time picker with Indian format
- ✅ Smart currency input with preview

### Color Coding
- 🔵 **New** - Blue
- 🔷 **Contacted** - Cyan
- 🟠 **Qualified** - Orange
- 🟣 **Proposal** - Purple
- 🟢 **Won** - Green

### Priority Badges
- 🔴 **High** - Red badge
- 🟡 **Medium** - Gray badge
- 🟢 **Low** - Gray badge

## 💻 Development

### Running in Development Mode
```bash
npm run dev          # Web version (localhost:8080)
npm run electron:dev # Desktop app with hot reload
```

### Building
```bash
npm run build                # Build web assets
npm run electron:build:win   # Build Windows installer (.exe)
```

### Testing
- Manual testing with sample leads
- Excel import/export validation
- Cross-browser compatibility (Chrome, Edge)

## 📦 Deployment

### Creating Windows Installer
1. Build the app:
   ```bash
   npm run build
   npm run electron:build:win
   ```

2. Installer will be in `dist-electron/` folder

3. Share the `.exe` file for one-click installation

## 🔧 Configuration

### Data Storage Location
Default: `C:\Users\[USERNAME]\Documents\WorkPipeline\`

To change location, edit `electron/main.cjs`:
```javascript
const dataFolder = path.join(app.getPath('documents'), 'WorkPipeline');
```

### Port Configuration
Default port: `8080`

To change, edit `vite.config.ts`:
```typescript
server: {
  port: 8080
}
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Vikas Maurya**
- GitHub: [@Vikas-Maurya-hack](https://github.com/Vikas-Maurya-hack)

## 🙏 Acknowledgments

- Built with React and Electron
- UI components from shadcn/ui
- Icons from Lucide React
- Charts powered by Recharts

---

Made with ❤️ in India 🇮🇳
