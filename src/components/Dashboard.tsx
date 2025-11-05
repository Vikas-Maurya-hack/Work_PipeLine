import { Card } from "@/components/ui/card";
import { TrendingUp, Users, CheckCircle2, Clock, IndianRupee } from "lucide-react";
import { Lead } from "@/types/lead";
import { LeadsPieChart } from "./LeadsPieChart";
import { MonthlyGraph } from "./MonthlyGraph";

interface DashboardProps {
  leads: Lead[];
}

export const Dashboard = ({ leads = [] }: DashboardProps) => {
  const totalLeads = leads.length;
  const inProgress = leads.filter((l) => ["contacted", "qualified", "proposal"].includes(l.status)).length;
  const completed = leads.filter((l) => l.status === "won").length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = totalLeads > 0 ? Math.round((completed / totalLeads) * 100) : 0;

  // Format Indian currency
  const formatValue = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  const stats = [
    { label: "Total Leads", value: totalLeads.toString(), icon: Users, color: "primary" },
    { label: "In Progress", value: inProgress.toString(), icon: Clock, color: "warning" },
    { label: "Completed", value: completed.toString(), icon: CheckCircle2, color: "success" },
    { label: "Pipeline Value", value: formatValue(totalValue), icon: IndianRupee, color: "primary" },
  ];
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 hover:shadow-lg transition-all duration-300 border-border bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyGraph leads={leads} />
        <LeadsPieChart leads={leads} />
      </div>
    </div>
  );
};
