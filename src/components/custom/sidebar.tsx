import { studentLinks } from '@/utils/links'
import Link from 'next/link'

export function Sidebar() {
  return (
    <div className="flex h-full w-30 flex-col items-center justify-center gap-8 bg-green-400 p-2">
      {studentLinks.map((link) => {
        return (
          <Link href={link.href} key={link.label} className="capitalize">
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
