import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  class?: string
  className?: string
}

const baseClasses =
  'h-2 w-full cursor-pointer appearance-none border border-border bg-background-0 accent-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'

function SliderComponent({
  class: classNameFromAstro,
  className,
  ...rest
}: SliderProps) {
  return (
    <input
      type="range"
      className={cn(baseClasses, className ?? classNameFromAstro)}
      {...rest}
    />
  )
}

export { SliderComponent as Slider }
export default SliderComponent
