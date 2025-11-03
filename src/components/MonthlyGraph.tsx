import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line, ComposedChart } from "recharts";

interface MonthlyGraphProps {
  leads: Lead[];
}

export const MonthlyGraph = ({ leads }: MonthlyGraphProps) => {
  // Group leads by month and calculate metrics
  const monthlyData = leads.reduce((acc, lead) => {
    const date = new Date(lead.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        totalLeads: 0,
        totalValue: 0,
        wonDeals: 0,
        conversionRate: 0
      };
    }
    
    acc[monthYear].totalLeads++;
    acc[monthYear].totalValue += lead.value;
    if (lead.status === 'won') {
      acc[monthYear].wonDeals++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate conversion rates and format values
  Object.values(monthlyData).forEach((month: any) => {
    month.conversionRate = month.totalLeads > 0 
      ? (month.wonDeals / month.totalLeads) * 100 
      : 0;
    month.totalValue = Math.round(month.totalValue / 1000); // Convert to K
  });

  const data = Object.values(monthlyData).sort((a: any, b: any) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  }).slice(-6); // Show last 6 months

  const chartConfig = {
    totalLeads: {
      label: "Total Leads",
      theme: { light: "#3b82f6", dark: "#3b82f6" }
    },
    totalValue: {
      label: "Value (K)",
      theme: { light: "#10b981", dark: "#10b981" }
    },
    conversionRate: {
      label: "Conversion Rate %",
      theme: { light: "#f59e0b", dark: "#f59e0b" }
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Monthly Performance</h3>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar yAxisId="left" dataKey="totalLeads" fill="#3b82f6" name="Total Leads" />
            <Bar yAxisId="left" dataKey="totalValue" fill="#10b981" name="Value (K)" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="conversionRate" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Conversion Rate %"
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </Card>
  );
};