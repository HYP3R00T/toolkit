import type { LabelHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string
  required?: boolean
  class?: string
  className?: string
  children?: ReactNode
}

function LabelComponent({
  htmlFor,
  required = false,
  class: classNameFromAstro,
  className,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('mb-3 block', className ?? classNameFromAstro)}
      {...rest}
    >
      {children}
      {required && <span className="text-red">*</span>}
    </label>
  )
}

export { LabelComponent as Label }
export default LabelComponent
