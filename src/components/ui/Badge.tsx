import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'outline' | 'accent'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  class?: string
  className?: string
  children?: ReactNode
}

const baseClasses =
  'inline-block w-fit px-3 py-1 text-xs font-medium tracking-wide uppercase'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'text-foreground-1',
  outline: 'border border-border bg-transparent text-foreground-1',
  accent: 'border border-accent bg-accent text-background-0',
}

function BadgeComponent({
  variant = 'default',
  class: classNameFromAstro,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        className ?? classNameFromAstro,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export { BadgeComponent as Badge }
export default BadgeComponent
