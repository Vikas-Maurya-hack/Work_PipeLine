import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface LeadsPieChartProps {
  leads: Lead[];
}

export const LeadsPieChart = ({ leads }: LeadsPieChartProps) => {
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: "New", value: statusCounts["new"] || 0 },
    { name: "Contacted", value: statusCounts["contacted"] || 0 },
    { name: "Qualified", value: statusCounts["qualified"] || 0 },
    { name: "Proposal", value: statusCounts["proposal"] || 0 },
    { name: "Won", value: statusCounts["won"] || 0 }
  ];

  const COLORS = {
    "New": "#3b82f6",      // blue
    "Contacted": "#10b981", // green
    "Qualified": "#f59e0b", // amber
    "Proposal": "#8b5cf6",  // purple
    "Won": "#10b981"       // green
  };

  const chartConfig = {
    new: {
      label: "New",
      theme: { light: COLORS["New"], dark: COLORS["New"] }
    },
    contacted: {
      label: "Contacted",
      theme: { light: COLORS["Contacted"], dark: COLORS["Contacted"] }
    },
    qualified: {
      label: "Qualified",
      theme: { light: COLORS["Qualified"], dark: COLORS["Qualified"] }
    },
    proposal: {
      label: "Proposal",
      theme: { light: COLORS["Proposal"], dark: COLORS["Proposal"] }
    },
    won: {
      label: "Won",
      theme: { light: COLORS["Won"], dark: COLORS["Won"] }
    }
  };

  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Lead Distribution</h3>
      <div className="text-sm text-muted-foreground mb-4">
        <p>Total Leads: {totalLeads}</p>
        <p>Total Pipeline Value: ${(totalValue / 1000).toFixed(0)}K</p>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={entry.name} 
                  fill={COLORS[entry.name as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Legend />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
};