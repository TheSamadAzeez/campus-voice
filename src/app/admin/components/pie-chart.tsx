'use client'

import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [
  { faculty: 'science', complaints: 275, fill: 'var(--color-chrome)' },
  { faculty: 'law', complaints: 200, fill: 'var(--color-safari)' },
  { faculty: 'art', complaints: 187, fill: 'var(--color-firefox)' },
  { faculty: 'education', complaints: 173, fill: 'purple' },
  { faculty: 'management science', complaints: 173, fill: 'var(--color-edge)' },
  { faculty: 'transport', complaints: 173, fill: 'var(--color-edge)' },
  { faculty: 'other', complaints: 90, fill: 'var(--color-other)' },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function ChartPieSimple() {
  return (
    <Card className="flex w-1/2 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Faculty Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="complaints" nameKey="faculty" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
