'use client'

import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export const description = 'A donut chart with an active sector'

interface ChartData {
  total: number
  pending: number
  resolved: number
  inReview: number
}

interface ChartPieDonutActiveProps {
  chartData: ChartData
}

const chartConfig = {
  count: {
    label: 'Count',
  },
  pending: {
    label: 'Pending',
    color: '#f97316', // purple
  },
  inReview: {
    label: 'In Review',
    color: '#8b5cf6', // orange
  },
  resolved: {
    label: 'Resolved',
    color: '#3b82f6', // blue
  },
} satisfies ChartConfig

export function ChartPieDonutActive({ chartData }: ChartPieDonutActiveProps) {
  // Transform the data for the pie chart
  const pieChartData = [
    { status: 'pending', count: chartData.pending, fill: chartConfig.pending.color },
    { status: 'inReview', count: chartData.inReview, fill: chartConfig.inReview.color },
    { status: 'resolved', count: chartData.resolved, fill: chartConfig.resolved.color },
  ]
  return (
    <Card className="flex w-1/2 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Complaint by Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieChartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
