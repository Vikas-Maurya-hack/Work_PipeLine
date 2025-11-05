import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';

// NOTE: This module is browser-safe. It does not use Node APIs.
// Excel files are downloaded to the user's machine. Imports use a File from an <input> element.

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

// Export to Excel (downloads a file in the browser)
export const exportToExcel = async (leads: Lead[], createCopy: boolean = false) => {
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
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filename = createCopy
      ? `leads-export-${new Date().toISOString().split('T')[0]}.xlsx`
      : 'leads_database.xlsx';
    saveAs(blob, filename);
    console.log('Excel file downloaded');
  } catch (error) {
    console.error('Failed to generate Excel file:', error);
    alert('Failed to generate Excel file');
  }
};

// Import from Excel (reads a File from an <input type="file">)
export const importFromExcel = async (file: File): Promise<Lead[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];

        // Validate headers
        const headers = (XLSX.utils.sheet_to_json(ws, { header: 1 })[0] || []) as string[];
        const missing = REQUIRED_COLUMNS.filter(c => !c.optional).filter(c => !headers.includes(c.key));
        if (missing.length) {
          const msg = `Missing required columns: ${missing.map(m => m.key).join(', ')}`;
          alert(msg);
          return reject(new Error(msg));
        }

        const jsonData = XLSX.utils.sheet_to_json(ws);
        const validationErrors: string[] = [];
        const validLeads: Lead[] = [];

        jsonData.forEach((row: any, index: number) => {
          if (Object.keys(row).length === 0) return;
          const rowErrors: string[] = [];
          REQUIRED_COLUMNS.forEach(column => {
            const value = row[column.key];
            const v = validateColumn(value, column);
            if (!v.valid) rowErrors.push(`${column.key}: ${v.error || 'Invalid value'}`);
          });
          if (rowErrors.length) {
            validationErrors.push(`Row ${index + 2}: ${rowErrors.join(', ')}`);
            return;
          }
          const lead: Lead = {
            id: row.ID || crypto.randomUUID(),
            title: String(row.Title).trim(),
            client: String(row.Client).trim(),
            value: Number(row.Value),
            date: row.Date || new Date().toISOString(),
            status: row.Status as LeadStatus,
            priority: row.Priority as LeadPriority,
            description: row.Description?.toString()?.trim() || '',
            email: row.Email?.toString()?.trim() || '',
            phone: row.Phone?.toString()?.trim() || '',
            createdAt: row['Created At'] || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          validLeads.push(lead);
        });

        if (validationErrors.length) {
          console.error('Validation errors:', validationErrors);
          if (!validLeads.length) return reject(new Error('No valid leads found in the file'));
          alert(`Imported ${validLeads.length} leads with ${validationErrors.length} errors`);
        } else {
          console.log(`Successfully imported ${validLeads.length} leads`);
        }

        resolve(validLeads);
      } catch (err) {
        console.error('Failed to parse Excel:', err);
        alert('Failed to parse Excel file');
        reject(err);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
      reject(new Error('Failed to read file'));
    };
    reader.readAsArrayBuffer(file);
  });
};

// Export a copy of the database
export const exportCopy = async (leads: Lead[]) => exportToExcel(leads, true);

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
  
  console.log('Template downloaded successfully');
};