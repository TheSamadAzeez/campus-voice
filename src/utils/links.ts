import { Bell, LayoutDashboard, LucideIcon, NotebookPen, NotepadText } from 'lucide-react'

interface NavLink {
  label: string
  href: string
  icon: LucideIcon
}

export const studentLinks: NavLink[] = [
  {
    label: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
  },
  {
    label: 'My Complaints',
    href: '/student/complaints',
    icon: NotepadText,
  },
  {
    label: 'Submit Complaint',
    href: '/student/complaints/submit',
    icon: NotebookPen,
  },
  {
    label: 'Notifications',
    href: '/student/notifications',
    icon: Bell,
  },
]

export const adminLinks: NavLink[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'All Complaints',
    href: '/admin/complaints',
    icon: NotepadText,
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
]
