'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface DataProps {
  month: string
  pending: number
  in_review: number
  resolved: number
}

const chartConfig = {
  pending: {
    label: 'pending',
    color: 'var(--chart-1)',
  },
  in_review: {
    label: 'in_review',
    color: '#800080',
  },
  resolved: {
    label: 'resolved',
    color: '#0202ff',
  },
} satisfies ChartConfig

export function ChartAreaGradient({ data }: { data?: DataProps[] }) {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Complaints Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInReview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#800080" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#800080" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0202ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0202ff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="resolved"
              type="natural"
              fill="url(#fillResolved)"
              fillOpacity={0.4}
              stroke="#0202ff"
              stackId="a"
            />
            <Area
              dataKey="in_review"
              type="natural"
              fill="url(#fillInReview)"
              fillOpacity={0.4}
              stroke="#800080"
              stackId="a"
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              fillOpacity={0.4}
              stroke="var(--color-pending)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
