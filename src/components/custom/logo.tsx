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
    <Link href="/" aria-label="ACME" className={cn('inline-block', containerClassName)}>
      <Image
        src="/images/logo.png"
        width={104}
        height={57}
        alt="ACME logo"
        className={cn(variant === 'light' ? 'invert' : '', className)}
      />
    </Link>
  )
}
