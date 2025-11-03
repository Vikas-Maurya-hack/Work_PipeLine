# Deployment Guide for Work Pipeline

This guide will help you set up and run the Work Pipeline application on your local machine.

## Prerequisites

1. Install Node.js:
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Follow the installation wizard

2. Install Git:
   - Download and install Git from [https://git-scm.com/](https://git-scm.com/)
   - Follow the installation wizard

## Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Vikas-Maurya-hack/Work_PipeLine.git
   cd Work_PipeLine
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the application:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Data Storage Location

The application will automatically store your data in:

- Windows: `%APPDATA%\work-pipeline\leads_database.xlsx`
- macOS: `~/Library/Preferences/work-pipeline/leads_database.xlsx`
- Linux: `~/.local/share/work-pipeline/leads_database.xlsx`

Backups are stored in a `backups` subfolder with the naming format: `leads-YYYY-MM-DD.xlsx`

## Usage Notes

1. Data is stored locally on your machine
2. Each user maintains their own separate database
3. Daily backups are created automatically
4. You can export/import data using the UI buttons

## Troubleshooting

1. If you see "No existing database found":
   - This is normal for first-time usage
   - The database will be created when you add your first lead

2. If you can't save data:
   - Check if you have write permissions in the AppData folder
   - Ensure no other program is using the Excel file

3. If the application won't start:
   - Ensure Node.js is installed correctly
   - Try deleting the `node_modules` folder and run `npm install` again

## Support

If you encounter any issues, please:
1. Check the console for error messages (F12 in your browser)
2. Contact the development team
3. Create an issue on GitHub