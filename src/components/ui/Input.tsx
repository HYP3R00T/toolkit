import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType
  placeholder?: string
  disabled?: boolean
  class?: string
  className?: string
  value?: string | number
  name?: string
  id?: string
  required?: boolean
}

const baseClasses =
  'w-full border bg-transparent px-4 py-4 text-sm transition-colors focus:outline-none'

function InputComponent({
  type = 'text',
  placeholder = '',
  disabled = false,
  class: classNameFromAstro,
  className,
  value,
  name,
  id,
  required = false,
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        baseClasses,
        'border-border',
        'text-foreground-0',
        'placeholder:text-foreground-3',
        'focus:border-foreground-0',
        disabled ? 'opacity-50 cursor-not-allowed' : undefined,
        className ?? classNameFromAstro,
      )}
      value={value}
      name={name}
      id={id}
      required={required}
      {...rest}
    />
  )
}

export { InputComponent as Input }
export default InputComponent
