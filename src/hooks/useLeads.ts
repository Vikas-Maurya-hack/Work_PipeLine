import { useState, useEffect } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { loadLeads, saveLeads } from "@/lib/storage";
import { exportToExcel } from "@/lib/excel";
import { toast } from "sonner";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      saveLeads(leads);
      // Check for auto-backup
      const lastBackup = localStorage.getItem('lastBackupDate');
      const today = new Date().toISOString().split('T')[0];
      
      // Create backup if we haven't backed up today
      if (lastBackup !== today) {
        exportToExcel(leads, true);
        localStorage.setItem('lastBackupDate', today);
        toast.success('Daily backup created successfully');
      }
    }
  }, [leads]);

  const addLead = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setLeads((prev) => [newLead, ...prev]);
    toast.success("Lead added successfully!");
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead))
    );
    toast.success("Lead updated!");
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    toast.success("Lead deleted!");
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
  };

  const filteredLeads = leads.filter(
    (lead) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      // split into terms so multi-word searches match more flexibly
      const terms = q.split(/\s+/).filter(Boolean);

      // fields to search across
      const haystack = [
        lead.title,
        lead.client,
        lead.email ?? "",
        lead.description ?? "",
        lead.status,
        lead.priority,
      ]
        .join(" ")
        .toLowerCase();

      // require all terms to be present somewhere in the concatenated fields
      return terms.every((t) => haystack.includes(t));
    }
  );

  return {
    leads: filteredLeads,
    allLeads: leads,
    searchQuery,
    setSearchQuery,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
  };
};
