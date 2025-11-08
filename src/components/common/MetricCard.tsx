import clsx from 'clsx'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subValue?: string
  icon?: ReactNode
  accent?: 'primary' | 'emerald' | 'blue' | 'amber' | 'rose' | 'slate'
}

const accentClasses: Record<NonNullable<MetricCardProps['accent']>, string> = {
  primary: 'bg-black text-white border border-black',
  emerald: 'bg-white text-black border border-black',
  blue: 'bg-white text-black border border-black',
  amber: 'bg-white text-black border border-black',
  rose: 'bg-white text-[#9f1239] border border-[#9f1239]',
  slate: 'bg-white text-black border border-black/40',
}

export const MetricCard = ({
  title,
  value,
  subValue,
  icon,
  accent = 'slate',
}: MetricCardProps) => {
  return (
    <div className="rounded-none border border-black/10 bg-white p-8 shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-black/50">
            {title}
          </p>
          <p className="mt-4 text-4xl font-normal tracking-[0.08em] text-black">{value}</p>
          {subValue ? (
            <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-black/45">{subValue}</p>
          ) : null}
        </div>
        {icon ? (
          <div
            className={clsx(
              'flex h-12 w-12 items-center justify-center rounded-none text-lg',
              accentClasses[accent],
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default MetricCard

