import { Badge } from "@/components/ui/badge";
import { Lead, LeadStatus } from "@/types/lead";
import { LeadCard } from "./LeadCard";

const stages: Array<{ id: LeadStatus; label: string; color: string }> = [
  { id: "new", label: "New Leads", color: "bg-primary/10 text-primary" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500/10 text-blue-600" },
  { id: "qualified", label: "Qualified", color: "bg-purple-500/10 text-purple-600" },
  { id: "proposal", label: "Proposal", color: "bg-orange-500/10 text-orange-600" },
  { id: "won", label: "Won", color: "bg-accent/10 text-accent" },
];

interface PipelineBoardProps {
  leads: Lead[];
  onDeleteLead: (id: string) => void;
  onEditLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  searchQuery?: string;
}

export const PipelineBoard = ({ 
  leads = [], 
  onDeleteLead,
  onEditLead,
  onUpdateStatus,
  searchQuery,
}: PipelineBoardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
      {stages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.status === stage.id);
        return (
          <div key={stage.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{stage.label}</h3>
              <Badge variant="secondary" className={stage.color}>
                {stageLeads.length}
              </Badge>
            </div>
            <div
              className="space-y-3 min-h-[200px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData("leadId");
                if (leadId) {
                  onUpdateStatus(leadId, stage.id);
                }
              }}
            >
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("leadId", lead.id);
                  }}
                >
                  <LeadCard lead={lead} onDelete={onDeleteLead} onEdit={onEditLead} searchQuery={searchQuery} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
