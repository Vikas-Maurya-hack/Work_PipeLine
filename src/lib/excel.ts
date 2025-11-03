import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { toast } from 'sonner';

// Fixed file location in the user's AppData directory
const APP_DATA_PATH = `${process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")}/work-pipeline`;
const FIXED_EXCEL_PATH = `${APP_DATA_PATH}/leads_database.xlsx`;

// Required columns configuration
const REQUIRED_COLUMNS = [
  { key: 'ID', type: 'string' },
  { key: 'Title', type: 'string' },
  { key: 'Client', type: 'string' },
  { key: 'Value', type: 'number' },
  { key: 'Date', type: 'date' },
  { key: 'Status', type: 'enum', values: ['new', 'contacted', 'qualified', 'proposal', 'won'] },
  { key: 'Priority', type: 'enum', values: ['high', 'medium', 'low'] },
  { key: 'Description', type: 'string', optional: true },
  { key: 'Email', type: 'string', optional: true },
  { key: 'Phone', type: 'string', optional: true },
  { key: 'Created At', type: 'date' },
  { key: 'Updated At', type: 'date' }
];

// Ensure data directory exists
const ensureDataDirectory = async () => {
  try {
    const fs = require('fs');
    if (!fs.existsSync(APP_DATA_PATH)) {
      fs.mkdirSync(APP_DATA_PATH, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating data directory:', error);
    toast.error('Failed to create data directory');
  }
};

// Validation function
const validateColumn = (value: any, column: typeof REQUIRED_COLUMNS[0]): { valid: boolean; error?: string } => {
  if (!value && !column.optional) {
    return { valid: false, error: `${column.key} is required` };
  }

  if (!value && column.optional) {
    return { valid: true };
  }

  switch (column.type) {
    case 'string':
      return { valid: typeof value === 'string' || value instanceof String };
    case 'number':
      return {
        valid: !isNaN(Number(value)),
        error: 'Must be a valid number'
      };
    case 'date':
      const date = new Date(value);
      return {
        valid: !isNaN(date.getTime()),
        error: 'Must be a valid date'
      };
    case 'enum':
      return {
        valid: column.values?.includes(value),
        error: `Must be one of: ${column.values?.join(', ')}`
      };
    default:
      return { valid: true };
  }
};

// Save to fixed Excel file location
export const exportToExcel = async (leads: Lead[]) => {
  await ensureDataDirectory();
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

  // Add validation sheet with column information
  const validationData = REQUIRED_COLUMNS.map(col => ({
    'Column': col.key,
    'Type': col.type,
    'Required': col.optional ? 'No' : 'Yes',
    'Valid Values': col.type === 'enum' ? col.values?.join(', ') : ''
  }));

  const dataWs = XLSX.utils.json_to_sheet(wsData);
  const validationWs = XLSX.utils.json_to_sheet(validationData);

  XLSX.utils.book_append_sheet(wb, dataWs, 'Leads');
  XLSX.utils.book_append_sheet(wb, validationWs, 'Column Info');

  try {
    const fs = require('fs');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    fs.writeFileSync(FIXED_EXCEL_PATH, excelBuffer);
    toast.success(`Data saved to ${FIXED_EXCEL_PATH}`);

    // Also create a backup copy
    const backupPath = `${APP_DATA_PATH}/backups/leads-${new Date().toISOString().split('T')[0]}.xlsx`;
    if (!fs.existsSync(`${APP_DATA_PATH}/backups`)) {
      fs.mkdirSync(`${APP_DATA_PATH}/backups`, { recursive: true });
    }
    fs.writeFileSync(backupPath, excelBuffer);
    toast.success('Backup created successfully');
  } catch (error) {
    console.error('Failed to save Excel file:', error);
    toast.error('Failed to save Excel file');
  }
};

// Load from fixed Excel file location
export const importFromExcel = async (file?: File): Promise<Lead[]> => {
  await ensureDataDirectory();
  
  try {
    const fs = require('fs');
    
    if (!fs.existsSync(FIXED_EXCEL_PATH)) {
      toast.info('No existing database found. Starting fresh.');
      return [];
    }

    const buffer = fs.readFileSync(FIXED_EXCEL_PATH);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get first worksheet
    const wsname = workbook.SheetNames[0];
    const ws = workbook.Sheets[wsname];

    // Convert to JSON and validate
    const jsonData = XLSX.utils.sheet_to_json(ws);
    const validLeads: Lead[] = [];
    const validationErrors: string[] = [];

    // Transform and validate the data
    jsonData.forEach((row: any, index: number) => {
      const rowNumber = index + 2; // Account for header row
      const rowErrors: string[] = [];

      // Check for empty row
      if (Object.keys(row).length === 0) {
        return; // Skip empty rows
      }

      // Validate each column
      REQUIRED_COLUMNS.forEach(column => {
        const value = row[column.key];
        const validation = validateColumn(value, column);
        if (!validation.valid) {
          rowErrors.push(`${column.key}: ${validation.error || 'Invalid value'}`);
        }
      });

      if (rowErrors.length > 0) {
        validationErrors.push(`Row ${rowNumber}: ${rowErrors.join(', ')}`);
        return;
      }

      // Create lead object
      const lead: Lead = {
        id: row.ID || crypto.randomUUID(),
        title: row.Title.trim(),
        client: row.Client.trim(),
        value: Number(row.Value),
        date: row.Date || new Date().toISOString(),
        status: row.Status as LeadStatus,
        priority: row.Priority as LeadPriority,
        description: row.Description?.trim() || '',
        email: row.Email?.trim() || '',
        phone: row.Phone?.trim() || '',
        createdAt: row['Created At'] || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      validLeads.push(lead);
    });

    if (validationErrors.length > 0) {
      toast.warning(`Loaded ${validLeads.length} leads with ${validationErrors.length} validation errors`);
    } else {
      toast.success(`Successfully loaded ${validLeads.length} leads`);
    }

    return validLeads;

  } catch (error) {
    console.error('Failed to load Excel file:', error);
    toast.error('Failed to load Excel file');
    return [];
  }
};

// Export a copy of the database
export const exportCopy = async () => {
  try {
    const fs = require('fs');
    if (fs.existsSync(FIXED_EXCEL_PATH)) {
      const buffer = fs.readFileSync(FIXED_EXCEL_PATH);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const copyName = `leads-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, copyName);
      toast.success('Created Excel export copy');
    } else {
      toast.error('No database file found to export');
    }
  } catch (error) {
    console.error('Failed to export Excel copy:', error);
    toast.error('Failed to export Excel copy');
  }
};

// Download empty template
export const downloadTemplate = () => {
  const wb = XLSX.utils.book_new();
  
  // Empty template with headers
  const templateWs = XLSX.utils.json_to_sheet([{}], {
    header: REQUIRED_COLUMNS.map(col => col.key)
  });
  
  // Validation info
  const validationData = REQUIRED_COLUMNS.map(col => ({
    'Column': col.key,
    'Type': col.type,
    'Required': col.optional ? 'No' : 'Yes',
    'Valid Values': col.type === 'enum' ? col.values?.join(', ') : ''
  }));
  const validationWs = XLSX.utils.json_to_sheet(validationData);

  XLSX.utils.book_append_sheet(wb, templateWs, 'Template');
  XLSX.utils.book_append_sheet(wb, validationWs, 'Column Info');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, 'leads-template.xlsx');
  
  toast.success('Template downloaded successfully');
};