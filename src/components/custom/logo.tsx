import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  containerClassName?: string
  variant?: 'light' | 'dark'
}

export function Logo({ className, containerClassName, variant = 'light' }: LogoProps) {
  return (
    <Link href="/" aria-label="Campus Voice" className={cn('inline-flex items-center gap-3', containerClassName)}>
      <Image src="/images/lasu-logo.png" width={70} height={70} alt="LASU logo" className="rounded-sm" />
      <Image
        src="/images/logo.png"
        width={104}
        height={57}
        alt="Campus Voice logo"
        className={cn(variant === 'light' ? 'invert' : '', className)}
      />
    </Link>
  )
}
