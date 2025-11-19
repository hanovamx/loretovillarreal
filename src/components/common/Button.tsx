import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const toneClasses: Record<ButtonTone, string> = {
  primary:
    'bg-primary text-white hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/40',
  secondary:
    'border border-black bg-white text-black hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/40',
  ghost:
    'border border-transparent bg-transparent text-black hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30',
  danger:
    'border border-[#9f1239] bg-transparent text-[#9f1239] hover:bg-[#9f1239] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9f1239]/40',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-xs md:text-sm',
  lg: 'px-8 py-4 text-sm md:text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone
  size?: ButtonSize
  uppercase?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export const Button = ({
  children,
  tone = 'primary',
  size = 'md',
  className,
  iconLeft,
  iconRight,
  uppercase = true,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-none font-medium tracking-[0.06em] transition focus-visible:outline-offset-4',
        toneClasses[tone],
        sizeClasses[size],
        uppercase ? 'uppercase' : '',
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}

export default Button

