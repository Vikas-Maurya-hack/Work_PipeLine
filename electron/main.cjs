const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// Data folder in user's Documents
const dataFolder = path.join(app.getPath('documents'), 'WorkPipeline');
const excelFilePath = path.join(dataFolder, 'leads_database.xlsx');

// Ensure data folder exists
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Work Pipeline - Lead Management System'
  });

  // In development, load from Vite dev server
  // In production, load from built files
  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the packaged files
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for file operations

// Get data folder path
ipcMain.handle('get-data-folder', () => {
  return dataFolder;
});

// Save leads to Excel file
ipcMain.handle('save-leads', async (event, leads) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Convert leads to worksheet format
    const wsData = leads.map(lead => ({
      'ID': lead.id,
      'Title': lead.title,
      'Client': lead.client,
      'Value': lead.value,
      'Date': lead.date,
      'Status': lead.status,
      'Priority': lead.priority,
      'Description': lead.description || '',
      'Email': lead.email || '',
      'Phone': lead.phone || '',
      'Created At': lead.createdAt,
      'Updated At': lead.updatedAt
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');

    // Write to file
    XLSX.writeFile(wb, excelFilePath);
    
    // Also create a backup
    const backupFolder = path.join(dataFolder, 'backups');
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = path.join(backupFolder, `leads-${timestamp}.xlsx`);
    XLSX.writeFile(wb, backupPath);

    return { success: true, path: excelFilePath };
  } catch (error) {
    console.error('Error saving leads:', error);
    return { success: false, error: error.message };
  }
});

// Load leads from Excel file
ipcMain.handle('load-leads', async () => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      return { success: true, leads: [] };
    }

    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const leads = jsonData.map(row => ({
      id: row.ID || crypto.randomUUID(),
      title: row.Title,
      client: row.Client,
      value: Number(row.Value),
      date: row.Date,
      status: row.Status,
      priority: row.Priority,
      description: row.Description || '',
      email: row.Email || '',
      phone: row.Phone || '',
      createdAt: row['Created At'] || new Date().toISOString(),
      updatedAt: row['Updated At'] || new Date().toISOString()
    }));

    return { success: true, leads };
  } catch (error) {
    console.error('Error loading leads:', error);
    return { success: false, error: error.message, leads: [] };
  }
});

// Export leads (download to user's Downloads folder)
ipcMain.handle('export-leads', async (event, leads) => {
  try {
    const wb = XLSX.utils.book_new();
    const wsData = leads.map(lead => ({
      'ID': lead.id,
      'Title': lead.title,
      'Client': lead.client,
      'Value': lead.value,
      'Date': lead.date,
      'Status': lead.status,
      'Priority': lead.priority,
      'Description': lead.description || '',
      'Email': lead.email || '',
      'Phone': lead.phone || ''
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');

    const timestamp = new Date().toISOString().split('T')[0];
    const exportPath = path.join(app.getPath('downloads'), `leads-export-${timestamp}.xlsx`);
    XLSX.writeFile(wb, exportPath);

    return { success: true, path: exportPath };
  } catch (error) {
    console.error('Error exporting leads:', error);
    return { success: false, error: error.message };
  }
});