import { Metadata } from 'next'
import { Suspense } from 'react'
import { NotificationsView } from './components/notifications-view'

export const metadata: Metadata = {
  title: 'Notifications | Campus Voice',
  description: 'View and manage your notifications',
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest changes to your complaints</p>
        </div>

        <Suspense fallback={<div>Loading notifications...</div>}>
          <NotificationsView />
        </Suspense>
      </div>
    </div>
  )
}
