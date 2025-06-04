import { LayoutDashboard, LucideIcon, NotebookPen, NotepadText, User } from 'lucide-react'

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
    href: '/student/my-complaints',
    icon: NotepadText,
  },
  {
    label: 'Submit Complaint',
    href: '/student/submit-complaint',
    icon: NotebookPen,
  },
  {
    label: 'My Profile',
    href: '/student/my-profile',
    icon: User,
  },
]
