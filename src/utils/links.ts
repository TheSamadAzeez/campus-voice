import { LayoutDashboard, LucideIcon, NotebookPen, NotepadText, User, Users } from 'lucide-react'

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
    label: 'My Profile',
    href: '/student/profile',
    icon: User,
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
    label: 'All Students',
    href: '/admin/students',
    icon: Users,
  },
]
