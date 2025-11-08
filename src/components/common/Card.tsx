import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  bordered?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = ({
  children,
  className,
  padding = 'md',
  bordered = false,
}: CardProps) => (
  <div
    className={clsx(
      'rounded-none bg-white border border-black/10 shadow-none',
      paddingMap[padding],
      bordered ? 'border border-black' : '',
      className,
    )}
  >
    {children}
  </div>
)

export default Card

