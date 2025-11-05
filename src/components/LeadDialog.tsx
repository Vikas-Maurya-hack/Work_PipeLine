import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadPriority, LeadStatus } from "@/types/lead";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  lead?: Lead;
  mode?: 'add' | 'edit';
}

export const LeadDialog = ({ open, onOpenChange, onSubmit, lead, mode = 'add' }: LeadDialogProps) => {
  // Helper function to format datetime for input field
  const getDateTimeLocalFormat = (date?: string) => {
    if (!date) {
      // Return current date and time in format: YYYY-MM-DDTHH:MM
      const now = new Date();
      return now.toISOString().slice(0, 16);
    }
    // Convert ISO string to datetime-local format
    return new Date(date).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState<Omit<Lead, "id" | "createdAt" | "updatedAt">>({
    title: "",
    client: "",
    value: 0,
    date: getDateTimeLocalFormat(),
    status: "new",
    priority: "medium",
    description: "",
    email: "",
    phone: "",
  });

  // Update form data when lead changes (for editing)
  useEffect(() => {
    if (lead && mode === 'edit') {
      setFormData({
        title: lead.title,
        client: lead.client,
        value: lead.value,
        date: getDateTimeLocalFormat(lead.date),
        status: lead.status,
        priority: lead.priority,
        description: lead.description || "",
        email: lead.email || "",
        phone: lead.phone || "",
      });
    } else if (!lead) {
      // Reset form when adding new lead
      setFormData({
        title: "",
        client: "",
        value: 0,
        date: getDateTimeLocalFormat(),
        status: "new",
        priority: "medium",
        description: "",
        email: "",
        phone: "",
      });
    }
  }, [lead, mode]);

  // Format number to Indian currency display
  const formatIndianNumber = (num: number): string => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} Lakh`;
    } else {
      return num.toLocaleString('en-IN');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    setFormData({
      title: "",
      client: "",
      value: 0,
      date: new Date().toISOString().split("T")[0],
      status: "new",
      priority: "medium",
      description: "",
      email: "",
      phone: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>
            Fill in the details for the lead. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Website Redesign"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@client.com"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Enter a valid email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  // Allow only numbers, +, spaces, and hyphens
                  const value = e.target.value.replace(/[^\d+\s-]/g, '');
                  setFormData({ ...formData, phone: value });
                }}
                pattern="^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$"
                placeholder="+91 98765 43210"
                title="Enter a valid phone number (e.g., +91 9876543210 or 9876543210)"
                minLength={10}
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                Format: +91 XXXXXXXXXX or 10-digit number
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Deal Value (₹) *</Label>
              <Input
                id="value"
                type="number"
                required
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                placeholder="5000000"
              />
              {formData.value > 0 && (
                <p className="text-xs text-muted-foreground">
                  ₹{formatIndianNumber(formData.value)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: LeadStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: LeadPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the project..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              {mode === 'edit' ? "Update Lead" : "Add Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
