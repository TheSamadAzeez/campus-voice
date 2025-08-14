'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const description = 'Interactive area chart showing complaint trends over time'

// 📊 Demo data for fallback when no real data is available
// This represents daily complaint counts across different statuses
const chartData = [
  { date: '2024-04-01', pending: 222, in_review: 150, resolved: 180 },
  { date: '2024-04-02', pending: 97, in_review: 180, resolved: 120 },
  { date: '2024-04-03', pending: 167, in_review: 120, resolved: 140 },
  { date: '2024-04-04', pending: 242, in_review: 260, resolved: 200 },
  { date: '2024-04-05', pending: 373, in_review: 290, resolved: 320 },
  { date: '2024-04-06', pending: 301, in_review: 340, resolved: 280 },
  { date: '2024-04-07', pending: 245, in_review: 180, resolved: 210 },
  { date: '2024-04-08', pending: 409, in_review: 320, resolved: 350 },
  { date: '2024-04-09', pending: 59, in_review: 110, resolved: 80 },
  { date: '2024-04-10', pending: 261, in_review: 190, resolved: 220 },
  { date: '2024-04-11', pending: 327, in_review: 350, resolved: 300 },
  { date: '2024-04-12', pending: 292, in_review: 210, resolved: 250 },
  { date: '2024-04-13', pending: 342, in_review: 380, resolved: 320 },
  { date: '2024-04-14', pending: 137, in_review: 220, resolved: 170 },
  { date: '2024-04-15', pending: 120, in_review: 170, resolved: 140 },
  { date: '2024-04-16', pending: 138, in_review: 190, resolved: 160 },
  { date: '2024-04-17', pending: 446, in_review: 360, resolved: 400 },
  { date: '2024-04-18', pending: 364, in_review: 410, resolved: 380 },
  { date: '2024-04-19', pending: 243, in_review: 180, resolved: 210 },
  { date: '2024-04-20', pending: 89, in_review: 150, resolved: 110 },
  { date: '2024-04-21', pending: 137, in_review: 200, resolved: 160 },
  { date: '2024-04-22', pending: 224, in_review: 170, resolved: 190 },
  { date: '2024-04-23', pending: 138, in_review: 230, resolved: 180 },
  { date: '2024-04-24', pending: 387, in_review: 290, resolved: 330 },
  { date: '2024-04-25', pending: 215, in_review: 250, resolved: 230 },
  { date: '2024-04-26', pending: 75, in_review: 130, resolved: 100 },
  { date: '2024-04-27', pending: 383, in_review: 420, resolved: 390 },
  { date: '2024-04-28', pending: 122, in_review: 180, resolved: 150 },
  { date: '2024-04-29', pending: 315, in_review: 240, resolved: 270 },
  { date: '2024-04-30', pending: 454, in_review: 380, resolved: 410 },
  { date: '2024-05-01', pending: 165, in_review: 220, resolved: 190 },
  { date: '2024-05-02', pending: 293, in_review: 310, resolved: 300 },
  { date: '2024-05-03', pending: 247, in_review: 190, resolved: 210 },
  { date: '2024-05-04', pending: 385, in_review: 420, resolved: 400 },
  { date: '2024-05-05', pending: 481, in_review: 390, resolved: 430 },
  { date: '2024-05-06', pending: 498, in_review: 520, resolved: 500 },
  { date: '2024-05-07', pending: 388, in_review: 300, resolved: 340 },
  { date: '2024-05-08', pending: 149, in_review: 210, resolved: 180 },
  { date: '2024-05-09', pending: 227, in_review: 180, resolved: 200 },
  { date: '2024-05-10', pending: 293, in_review: 330, resolved: 310 },
  { date: '2024-05-11', pending: 335, in_review: 270, resolved: 300 },
  { date: '2024-05-12', pending: 197, in_review: 240, resolved: 210 },
  { date: '2024-05-13', pending: 197, in_review: 160, resolved: 170 },
  { date: '2024-05-14', pending: 448, in_review: 490, resolved: 460 },
  { date: '2024-05-15', pending: 473, in_review: 380, resolved: 420 },
  { date: '2024-05-16', pending: 338, in_review: 400, resolved: 360 },
  { date: '2024-05-17', pending: 499, in_review: 420, resolved: 450 },
  { date: '2024-05-18', pending: 315, in_review: 350, resolved: 330 },
  { date: '2024-05-19', pending: 235, in_review: 180, resolved: 200 },
  { date: '2024-05-20', pending: 177, in_review: 230, resolved: 200 },
  { date: '2024-05-21', pending: 82, in_review: 140, resolved: 110 },
  { date: '2024-05-22', pending: 81, in_review: 120, resolved: 100 },
  { date: '2024-05-23', pending: 252, in_review: 290, resolved: 270 },
  { date: '2024-05-24', pending: 294, in_review: 220, resolved: 250 },
  { date: '2024-05-25', pending: 201, in_review: 250, resolved: 220 },
  { date: '2024-05-26', pending: 213, in_review: 170, resolved: 190 },
  { date: '2024-05-27', pending: 420, in_review: 460, resolved: 440 },
  { date: '2024-05-28', pending: 233, in_review: 190, resolved: 210 },
  { date: '2024-05-29', pending: 78, in_review: 130, resolved: 100 },
  { date: '2024-05-30', pending: 340, in_review: 280, resolved: 310 },
  { date: '2024-05-31', pending: 178, in_review: 230, resolved: 200 },
  { date: '2024-06-01', pending: 178, in_review: 200, resolved: 190 },
  { date: '2024-06-02', pending: 470, in_review: 410, resolved: 440 },
  { date: '2024-06-03', pending: 103, in_review: 160, resolved: 130 },
  { date: '2024-06-04', pending: 439, in_review: 380, resolved: 410 },
  { date: '2024-06-05', pending: 88, in_review: 140, resolved: 110 },
  { date: '2024-06-06', pending: 294, in_review: 250, resolved: 270 },
  { date: '2024-06-07', pending: 323, in_review: 370, resolved: 340 },
  { date: '2024-06-08', pending: 385, in_review: 320, resolved: 350 },
  { date: '2024-06-09', pending: 438, in_review: 480, resolved: 460 },
  { date: '2024-06-10', pending: 155, in_review: 200, resolved: 180 },
  { date: '2024-06-11', pending: 92, in_review: 150, resolved: 120 },
  { date: '2024-06-12', pending: 492, in_review: 420, resolved: 450 },
  { date: '2024-06-13', pending: 81, in_review: 130, resolved: 100 },
  { date: '2024-06-14', pending: 426, in_review: 380, resolved: 400 },
  { date: '2024-06-15', pending: 307, in_review: 350, resolved: 330 },
  { date: '2024-06-16', pending: 371, in_review: 310, resolved: 340 },
  { date: '2024-06-17', pending: 475, in_review: 520, resolved: 500 },
  { date: '2024-06-18', pending: 107, in_review: 170, resolved: 140 },
  { date: '2024-06-19', pending: 341, in_review: 290, resolved: 310 },
  { date: '2024-06-20', pending: 408, in_review: 450, resolved: 430 },
  { date: '2024-06-21', pending: 169, in_review: 210, resolved: 190 },
  { date: '2024-06-22', pending: 317, in_review: 270, resolved: 290 },
  { date: '2024-06-23', pending: 480, in_review: 530, resolved: 500 },
  { date: '2024-06-24', pending: 132, in_review: 180, resolved: 160 },
  { date: '2024-06-25', pending: 141, in_review: 190, resolved: 170 },
  { date: '2024-06-26', pending: 434, in_review: 380, resolved: 400 },
  { date: '2024-06-27', pending: 448, in_review: 490, resolved: 470 },
  { date: '2024-06-28', pending: 149, in_review: 200, resolved: 180 },
  { date: '2024-06-29', pending: 103, in_review: 160, resolved: 130 },
  { date: '2024-06-30', pending: 446, in_review: 400, resolved: 420 },
]

// 🎨 Chart styling and configuration
const chartConfig = {
  visitors: {
    label: 'Complaints',
  },
  pending: {
    label: 'Pending',
    color: 'var(--chart-1)', // Orange color for pending complaints
  },
  in_review: {
    label: 'In Review',
    color: '#800080', // Purple color for complaints under review
  },
  resolved: {
    label: 'Resolved',
    color: '#0202ff', // Blue color for resolved complaints
  },
} satisfies ChartConfig

interface ComplaintChartData {
  date: string
  pending: number
  in_review: number
  resolved: number
}

interface ChartAreaInteractiveProps {
  chartData?: ComplaintChartData[]
}

export function ChartAreaInteractive({ chartData: realTimeData }: ChartAreaInteractiveProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('90d')

  // 📊 Choose data source: real data from database or demo data for fallback
  const chartDataSource = realTimeData && realTimeData.length > 0 ? realTimeData : chartData

  // 🗓️ Calculate date range based on selected time period
  const getDateRangeInDays = (range: string): number => {
    switch (range) {
      case '7d':
        return 7
      case '30d':
        return 30
      case '90d':
        return 90
      default:
        return 90
    }
  }

  // 🔍 Filter data to show only the selected time range
  const getFilteredChartData = (): ComplaintChartData[] => {
    const daysToShow = getDateRangeInDays(selectedTimeRange)
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - daysToShow)

    return chartDataSource.filter((dataPoint) => {
      const dataDate = new Date(dataPoint.date)
      return dataDate >= startDate
    })
  }

  const filteredData = getFilteredChartData()

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Complaint Trends Over Time</CardTitle>
          <CardDescription>Track complaint status changes over the selected time period</CardDescription>
        </div>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            {/* 🎨 Gradient definitions for each complaint status */}
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInReview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-in_review)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-in_review)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* 📊 Chart grid and axis configuration */}
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />

            {/* 🖱️ Interactive tooltip configuration */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            {/* 📈 Stacked area layers - order matters for visual hierarchy */}
            <Area
              dataKey="resolved"
              type="natural"
              fill="url(#fillResolved)"
              stroke="var(--color-resolved)"
              stackId="a"
            />
            <Area
              dataKey="in_review"
              type="natural"
              fill="url(#fillInReview)"
              stroke="var(--color-in_review)"
              stackId="a"
            />
            <Area dataKey="pending" type="natural" fill="url(#fillPending)" stroke="var(--color-pending)" stackId="a" />

            {/* 📋 Chart legend */}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
