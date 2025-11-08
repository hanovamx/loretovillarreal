import clsx from 'clsx'
import type { ReactNode } from 'react'

type BadgeTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary'
  | 'muted'
  | 'outline'

const toneClasses: Record<BadgeTone, string> = {
  default: 'bg-black text-white',
  success: 'border border-black bg-white text-black',
  warning: 'border border-black bg-transparent text-black',
  danger: 'border border-[#9f1239] bg-transparent text-[#9f1239]',
  info: 'border border-black bg-transparent text-black',
  primary: 'bg-primary text-white',
  muted: 'border border-black/40 bg-white text-black/70',
  outline: 'border border-black bg-transparent text-black',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  uppercase?: boolean
  className?: string
}

export const Badge = ({ tone = 'default', children, uppercase = true, className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-none px-3 py-1 text-[11px] font-medium tracking-[0.12em]',
        toneClasses[tone],
        uppercase ? 'uppercase' : '',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge

