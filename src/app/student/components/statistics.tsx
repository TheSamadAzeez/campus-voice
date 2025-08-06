import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertCircle, CheckCircle2, Clock, LucideIcon } from 'lucide-react'

const COMPLAINT_CARDS: CardProps[] = [
  {
    id: 1,
    title: 'Total Complaints',

    icon: Activity,
    color: 'green',
  },
  {
    id: 2,
    title: 'Resolved Complaints',
    icon: CheckCircle2,
    color: 'blue',
  },
  {
    id: 3,
    title: 'In Review',
    icon: Clock,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Pending Complaints',
    icon: AlertCircle,
    color: '#f55612',
  },
]
interface CardProps {
  id: number
  title: string
  icon: LucideIcon
  color: string
}

interface ComplaintStats {
  total: number
  pending: number
  resolved: number
  inReview: number
}

export function Statistics({ stats }: { stats: ComplaintStats }) {
  const getStatValue = (title: string): number => {
    if (title === 'Total Complaints') {
      return stats.total
    } else if (title === 'Resolved Complaints') {
      return stats.resolved
    } else if (title === 'In Review') {
      return stats.inReview
    } else if (title === 'Pending Complaints') {
      return stats.pending
    } else {
      return 0
    }
  }

  return (
    <div className="grid w-1/2 grid-cols-2 gap-4">
      {COMPLAINT_CARDS.map((card) =>
        card.title === 'Total Complaints' ? (
          <Card key={card.id} className="bg-[#24c0b7] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <div className="rounded-2xl bg-[#f1f5f9] p-3">
                <card.icon color={card.color} size={20} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-start">
              <div className="text-3xl font-bold">{getStatValue(card.title)}</div>
            </CardContent>
          </Card>
        ) : (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <div className="rounded-2xl bg-[#f1f5f9] p-3">
                <card.icon color={card.color} size={20} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-start">
              <div className="text-3xl font-bold">{getStatValue(card.title)}</div>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  )
}
