'use client'

import { studentLinks } from '@/utils/links'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-30 flex-col items-center justify-center gap-15 py-2">
      {studentLinks.map((link) => {
        return (
          <div
            key={link.label}
            className={`flex w-full flex-col items-center justify-center py-2 ${pathname === link.href ? 'border-r-3 border-r-[#24c0b7]' : ''}`}
          >
            <Link href={link.href} className={`${pathname === link.href ? 'text-[#24c0b7]' : 'text-gray-500'}`}>
              {<link.icon />}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
