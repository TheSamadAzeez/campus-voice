'use client'

import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface ChartData {
  faculty: string
  complaints: number
  fill: string
}

const chartConfig = {
  complaints: {
    label: 'Complaints',
  },
  science: {
    label: 'Science',
    color: '#3b82f6',
  },
  law: {
    label: 'Law',
    color: '#dc2626',
  },
  arts: {
    label: 'Arts',
    color: '#059669',
  },
  education: {
    label: 'Education',
    color: '#d97706',
  },
  management: {
    label: 'Management Science',
    color: '#7c3aed',
  },
  transport: {
    label: 'Transport',
    color: '#0891b2',
  },
  other: {
    label: 'Other',
    color: '#4b5563',
  },
} satisfies ChartConfig

interface ChartPieSimpleProps {
  chartData: ChartData[]
}

export function ChartPieSimple({ chartData }: ChartPieSimpleProps) {
  // Fallback data if no chart data is provided
  const displayData = chartData?.length > 0 ? chartData : [{ faculty: 'No Data', complaints: 1, fill: '#e5e7eb' }]

  return (
    <Card className="flex w-1/2 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Complaints by Faculty</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center gap-6 pb-0">
        <div className="flex-1">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={displayData} dataKey="complaints" nameKey="faculty" strokeWidth={2} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Legend */}
        <div className="flex min-w-[120px] flex-col gap-2">
          {displayData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-muted-foreground text-sm capitalize">{item.faculty}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
