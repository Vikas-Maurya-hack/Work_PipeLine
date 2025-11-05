import { useState, useEffect } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { loadLeads, saveLeads } from "@/lib/storage";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load leads from storage (async)
    const initializeLeads = async () => {
      try {
        const loadedLeads = await loadLeads();
        setLeads(loadedLeads);
      } catch (error) {
        console.error('Failed to load leads:', error);
        alert('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLeads();
  }, []);

  useEffect(() => {
    // Save leads whenever they change (async)
    if (!isLoading && leads.length >= 0) {
      saveLeads(leads).catch((error) => {
        console.error('Failed to save leads:', error);
        alert('Failed to save data');
      });
    }
  }, [leads, isLoading]);

  const addLead = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setLeads((prev) => [newLead, ...prev]);
    alert("Lead added successfully!");
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead))
    );
    alert("Lead updated!");
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    alert("Lead deleted!");
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
