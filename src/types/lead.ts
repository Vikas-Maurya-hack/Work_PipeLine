export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won";
export type LeadPriority = "high" | "medium" | "low";

export interface Lead {
  id: string;
  title: string;
  client: string;
  value: number;
  date: string;
  status: LeadStatus;
  priority: LeadPriority;
  description?: string;
  email?: string;
  phone?: string;
}
