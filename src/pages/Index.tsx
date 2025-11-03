import { useState } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { PipelineBoard } from "@/components/PipelineBoard";
import { LeadDialog } from "@/components/LeadDialog";
import { useLeads } from "@/hooks/useLeads";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    leads,
    allLeads,
    searchQuery,
    setSearchQuery,
    addLead,
    deleteLead,
    updateLeadStatus,
  } = useLeads();

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-top bg-fixed">
      <div className="min-h-screen bg-white/50 dark:bg-black/50 backdrop-blur-[2px]">
      <Header
        onAddLead={() => setIsDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        leads={allLeads}
        onImportLeads={(importedLeads) => {
          importedLeads.forEach(lead => addLead(lead));
        }}
      />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your pipeline performance and key metrics</p>
        </div>
  <Dashboard leads={leads} />
        
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sales</h2>
          <p className="text-muted-foreground">Drag and drop leads between stages to update their status</p>
        </div>
        <PipelineBoard
          leads={leads}
          onDeleteLead={deleteLead}
          onUpdateStatus={updateLeadStatus}
          searchQuery={searchQuery}
        />
      </main>

      <LeadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={addLead}
      />
      </div>
    </div>
  );
};

export default Index;
