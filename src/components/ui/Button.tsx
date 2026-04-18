import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { cn } from '@/lib/cn'

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

type SharedButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  class?: string
  className?: string
  children?: ReactNode
}

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> & {
    as?: 'button'
    type?: 'button' | 'submit' | 'reset'
  }

type AnchorButtonProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    as: 'a'
  }

export type ButtonProps = NativeButtonProps | AnchorButtonProps

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50'

const sizeClasses: Record<ButtonSize, string> = {
  default: 'text-sm px-4 py-2',
  sm: 'text-xs px-3 py-1.5',
  lg: 'text-base px-6 py-3',
  icon: 'size-8 p-0 shrink-0 [&>svg]:size-4',
  'icon-sm': 'size-6.5 p-0 shrink-0 [&>svg]:size-3.25',
  'icon-lg': 'size-10.5 p-0 shrink-0 [&>svg]:size-5.25',
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'border border-foreground-0 bg-foreground-0 text-background-0 hover:bg-background-0 hover:text-foreground-0',
  secondary:
    'border border-border bg-transparent text-foreground-1 hover:bg-foreground-0/10 hover:text-foreground-0',
  outline:
    'border border-border bg-transparent hover:bg-none hover:text-foreground-0',
  ghost: 'bg-transparent hover:bg-foreground-0/10 hover:text-foreground-0',
  link: 'bg-transparent text-foreground-1 underline-offset-4 hover:underline hover:text-foreground-0',
}

function ButtonComponent({
  as = 'button',
  variant = 'default',
  size = 'default',
  class: classNameFromAstro,
  className,
  children,
  ...rest
}: ButtonProps) {
  const resolvedClassName = className ?? classNameFromAstro
  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    resolvedClassName,
  )

  if (as === 'a') {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>

    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  )
}

export { ButtonComponent as Button }
export default ButtonComponent
