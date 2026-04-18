import type { ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  class?: string
  className?: string
  children?: ReactNode
}

const baseClasses =
  'w-full appearance-none border pl-3 pr-10 text-sm transition-colors focus:outline-none'

function SelectComponent({
  class: classNameFromAstro,
  className,
  children,
  ...rest
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          baseClasses,
          'h-9 bg-background-0 border-border text-foreground-0 focus:border-foreground-0',
          className ?? classNameFromAstro,
        )}
        {...rest}
      >
        {children}
      </select>

      <span
        aria-hidden="true"
        className="text-foreground-2 pointer-events-none absolute inset-y-0 right-3 flex items-center"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M4 6.5L8 10.5L12 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}

export { SelectComponent as Select }
export default SelectComponent
