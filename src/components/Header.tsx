import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload, FileDown } from "lucide-react";
import { exportToExcel, importFromExcel, downloadTemplate } from "@/lib/excel";
import { Lead } from "@/types/lead";
import { useRef } from "react";

interface HeaderProps {
  onAddLead: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  leads: Lead[];
  onImportLeads: (leads: Lead[]) => void;
}

export const Header = ({ onAddLead, searchQuery, onSearchChange, leads, onImportLeads }: HeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="./images/riyas-icon.png" alt="Riyas" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Riyas-Space</h1>
              <p className="text-xs text-muted-foreground">Track, manage, and close deals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, client, or email..."
                className="pl-10 bg-background border-border"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const importedLeads = await importFromExcel(file);
                    onImportLeads(importedLeads);
                  } catch (error) {
                    console.error('Failed to import Excel:', error);
                  }
                }
                // Clear the input so the same file can be selected again
                e.target.value = '';
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => downloadTemplate()}
              title="Download Template"
            >
              <FileDown className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Import from Excel"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => exportToExcel(leads)}
              title="Export to Excel"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              onClick={onAddLead}
              className="bg-primary hover:bg-primary-dark text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Lead</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
