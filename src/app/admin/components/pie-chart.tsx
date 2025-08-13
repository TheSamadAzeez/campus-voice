'use client'

import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [
  { faculty: 'Science', complaints: 275, fill: '#3b82f6' },
  { faculty: 'Law', complaints: 200, fill: '#dc2626' },
  { faculty: 'Arts', complaints: 187, fill: '#059669' },
  { faculty: 'Education', complaints: 173, fill: '#d97706' },
  { faculty: 'Management Science', complaints: 158, fill: '#7c3aed' },
  { faculty: 'Transport', complaints: 142, fill: '#0891b2' },
  { faculty: 'Other', complaints: 90, fill: '#4b5563' },
]

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

export function ChartPieSimple() {
  return (
    <Card className="flex w-1/2 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Complaints by Faculty</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="complaints" nameKey="faculty" strokeWidth={2} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
