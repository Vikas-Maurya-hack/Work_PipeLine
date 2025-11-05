# Simple Installation Guide

## Quick Start (One-Click Installation)

1. **Download** the ZIP file from GitHub releases
2. **Extract** it to any folder on your computer (e.g., `C:\WorkPipeline`)
3. **Double-click** `Start Work Pipeline.vbs` (Recommended - Runs hidden in background)
   - *Alternative:* Double-click `Start Work Pipeline.bat` (Shows terminal window)
4. **Wait** for the browser to open automatically

**That's it!** The application will open in your browser and run silently in the background.

## What Happens Automatically

✅ Runs completely hidden (no terminal window)  
✅ Checks if Node.js is installed (if not, shows download link)  
✅ Installs all required dependencies (first time only)  
✅ Starts the development server in background  
✅ Opens your default browser automatically  
✅ Creates Excel database in your user folder  

## Data Storage

Your lead data is automatically stored as Excel files:

**Main Database:**
- Windows: `%USERPROFILE%\Documents\WorkPipeline\leads_database.xlsx`
- All your leads are saved here automatically

**How to Access Your Data:**
1. Click the **"Export"** button in the app to download a copy
2. Your data is saved every time you add, edit, or delete a lead
3. You can open the exported Excel file in Microsoft Excel or Google Sheets

**Sharing Data:**
- Click **"Export"** to download your leads as an Excel file
- Send the file to anyone
- They can click **"Import"** to load your data into their app

## System Requirements

- **Windows**: 7, 8, 10, or 11
- **Node.js**: Will be checked automatically (if missing, you'll get a download link)
- **Internet**: Required for first-time setup only
- **Browser**: Chrome, Edge, Firefox, or Safari

## Troubleshooting

### Terminal Closes Immediately
- Make sure you extracted ALL files from the ZIP
- Right-click `Start Work Pipeline.bat` → Run as Administrator

### "Node.js not installed" Message
1. The script will show you the download link
2. Go to https://nodejs.org/
3. Download and install Node.js LTS version
4. Restart your computer
5. Run `Start Work Pipeline.bat` again

### Dependencies Installation Fails
1. Close the terminal
2. Delete the `node_modules` folder (if it exists)
3. Run `Start Work Pipeline.bat` again

### Browser Doesn't Open Automatically
- Look at the terminal window
- You'll see a URL like `http://localhost:8080/`
- Copy and paste it into your browser

### Port Already in Use
- If you see "Port 8080 is in use"
- The app will automatically use port 8081 or another available port
- The browser will still open automatically with the correct URL

## Using the Application

### Adding Leads
1. Click **"+ Add Lead"** button
2. Fill in the lead details
3. Click **"Add Lead"**
4. ✅ Automatically saved to Excel!

### Viewing Data in Excel
1. Click **"Export"** button in the header
2. Open the downloaded Excel file
3. You'll see two sheets:
   - **Leads**: All your lead data
   - **Column Info**: Data format reference

### Importing Leads
1. Prepare your Excel file with the correct columns
2. Click **"Import"** button
3. Select your Excel file
4. ✅ All valid leads will be imported!

### Moving Leads in Pipeline
- Simply **drag and drop** leads between columns
- Status updates automatically
- ✅ Saved to Excel instantly!

## Stopping the Application

**To close the app:**

Since the app runs hidden in the background:

1. Open **Task Manager** (Press `Ctrl + Shift + Esc`)
2. Go to **Details** tab
3. Find **node.exe** process
4. Right-click → **End Task**

*Alternatively:*
- Restart your computer (the process will stop automatically)

**Your data is safe!** All changes are automatically saved to Excel files.

## For Advanced Users

### Manual Commands

If you prefer using command line:

```bash
# Navigate to project folder
cd path\to\WorkPipeline

# Install dependencies
npm install

# Start the app
npm run dev

# Build for production
npm run build
```

### File Locations

- **Project Files**: Where you extracted the ZIP
- **Excel Data**: `%USERPROFILE%\Documents\WorkPipeline\`
- **Dependencies**: `node_modules` folder (created automatically)

## Need Help?

1. Check the terminal window for error messages
2. Make sure you have internet connection (first time only)
3. Try running as Administrator
4. Contact the development team
5. Create an issue on GitHub: https://github.com/Vikas-Maurya-hack/Work_PipeLine/issues

## Updates

To get the latest version:
1. Download the new ZIP file from GitHub releases
2. Extract to a new folder
3. Your old data is safe (it's in a separate folder)
4. Export from old version, Import to new version if needed