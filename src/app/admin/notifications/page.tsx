import { Metadata } from 'next'
import { Suspense } from 'react'
import { AdminNotificationsView } from './components/admin-notifications-view'

export const metadata: Metadata = {
  title: 'Notifications | Campus Voice Admin',
  description: 'View and manage admin notifications',
}

export default function AdminNotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Notifications</h1>
          <p className="text-muted-foreground">Stay updated with new complaint submissions and system updates</p>
        </div>

        <Suspense fallback={<div>Loading notifications...</div>}>
          <AdminNotificationsView />
        </Suspense>
      </div>
    </div>
  )
}
