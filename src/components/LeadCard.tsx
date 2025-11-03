import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, User, DollarSign, MoreVertical, Mail, Phone, Trash2 } from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadCardProps {
  lead: Lead;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export const LeadCard = ({ lead, onDelete, searchQuery }: LeadCardProps) => {

  const highlight = (text?: string) => {
    if (!text) return null;
    const q = (searchQuery || "").trim();
    if (!q) return text;

    const terms = q.split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (terms.length === 0) return text;
    const pattern = terms.join("|");
    const parts = text.split(new RegExp(`(${pattern})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          new RegExp(`^(${pattern})$`, "i").test(part) ? (
            <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const matchedFields = () => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    const fields: string[] = [];
    const check = (value?: string) => {
      if (!value) return false;
      const lower = value.toLowerCase();
      return terms.some((t) => lower.includes(t));
    };
    if (check(lead.title)) fields.push("Title");
    if (check(lead.client)) fields.push("Client");
    if (check(lead.description)) fields.push("Description");
    if (check(lead.email)) fields.push("Email");
    if (check(lead.phone)) fields.push("Phone");
    return fields;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-border bg-card group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {searchQuery ? highlight(lead.title) : lead.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span>{searchQuery ? highlight(lead.client) : lead.client}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(lead.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {lead.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{searchQuery ? highlight(lead.description) : lead.description}</p>
        )}

        {(lead.email || lead.phone) && (
          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{searchQuery ? highlight(lead.email) : lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{searchQuery ? highlight(lead.phone) : lead.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* matched fields indicator */}
        {searchQuery && (
          <div className="text-xs text-muted-foreground">
            {matchedFields().length > 0 && (
              <div className="mt-1 text-[11px] text-muted-foreground">Matched: {matchedFields().join(", ")}</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-accent font-semibold">
            <DollarSign className="w-4 h-4" />
            ${lead.value.toLocaleString()}
          </div>
          <Badge
            variant={lead.priority === "high" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {lead.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(lead.date).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};
