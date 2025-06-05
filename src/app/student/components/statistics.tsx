import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ComplaintStats {
  id: number
  title: string
  value: number
  icon: LucideIcon
  color: string
}

export function Statistics({ stats }: { stats: ComplaintStats[] }) {
  return (
    <div className="grid w-1/2 grid-cols-2 gap-4">
      {stats.map((stat) =>
        stat.title === 'Total Complaints' ? (
          <Card key={stat.id} className="bg-[#24c0b7] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
              <div className="rounded-2xl bg-[#f1f5f9] p-3">
                <stat.icon color={stat.color} size={20} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-start">
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ) : (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
              <div className="rounded-2xl bg-[#f1f5f9] p-3">
                <stat.icon color={stat.color} size={20} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-start">
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  )
}
