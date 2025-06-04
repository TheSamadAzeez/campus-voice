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
            className={`group flex w-full flex-col items-center justify-center py-2 transition-all duration-300 hover:border-r-3 hover:border-r-[#24c0b7] ${pathname === link.href ? 'border-r-3 border-r-[#24c0b7]' : ''}`}
          >
            <Link
              href={link.href}
              aria-label={link.label}
              className={`flex w-full items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:text-[#24c0b7] ${pathname === link.href ? 'text-[#24c0b7]' : 'text-gray-500'}`}
            >
              {<link.icon size={23} />}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
