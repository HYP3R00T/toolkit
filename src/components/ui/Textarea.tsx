import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  disabled?: boolean
  rows?: number
  class?: string
  className?: string
  value?: string
  name?: string
  id?: string
  required?: boolean
}

const baseClasses =
  'w-full border bg-transparent px-4 py-4 text-sm resize-none transition-colors focus:outline-none'

function TextareaComponent({
  placeholder = '',
  disabled = false,
  rows = 6,
  class: classNameFromAstro,
  className,
  value,
  name,
  id,
  required = false,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={cn(
        baseClasses,
        'border-border',
        'text-foreground-1',
        'placeholder:text-foreground-3',
        'focus:border-foreground-0',
        disabled ? 'opacity-50 cursor-not-allowed' : undefined,
        className ?? classNameFromAstro,
      )}
      name={name}
      id={id}
      required={required}
      value={value}
      {...rest}
    />
  )
}

export { TextareaComponent as Textarea }
export default TextareaComponent
