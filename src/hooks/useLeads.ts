import { useState, useEffect } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { loadLeads, saveLeads } from "@/lib/storage";
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
    }
  }, [leads]);

  const addLead = (lead: Omit<Lead, "id">) => {
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
    };
    setLeads((prev) => [newLead, ...prev]);
    toast.success("Lead added successfully!");
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
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
