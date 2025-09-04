import * as React from 'react'
import { Ban, Car } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TimelineItem = {
  key: string
  label: React.ReactNode // allow string or JSX for tooltip
  status?: 'completed' | 'in-progress' | 'pending' | 'error'
  description?: string
  time?: string
  action?: React.ReactNode // optional action node
}

export function Timeline({
  items,
  currentKey,
  direction = 'horizontal',
  className,
}: {
  items: Array<TimelineItem>
  currentKey?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}) {
  const currentIdx = currentKey ? items.findIndex((i) => i.key === currentKey) : -1

  // Helper to get color classes
  function getStepColor(idx: number, item: TimelineItem) {
    const isCurrent = idx === currentIdx || item.status === 'in-progress'
    const isCompleted = idx < currentIdx || item.status === 'completed'
    if (isCurrent) return 'bg-primary text-white'
    if (isCompleted) return 'bg-green-100 text-green-700'
    return 'bg-gray-200 text-gray-500'
  }

  if (direction === 'vertical') {
    return (
      <ol className={cn('relative border-s border-gray-200 dark:border-gray-700', className)}>
        {items.map((item, idx) => {
          const isCurrent = idx === currentIdx || item.status === 'in-progress'
          const isCompleted = idx < currentIdx || item.status === 'completed'
          let content: React.ReactNode
          if (item.key === 'CONTRACT_SIGNED') {
            content = <Car size={24} />
          } else if (item.key === 'CANCEL' || item.key === 'NO_DEPOSIT') {
            content = <Ban size={24} />
          } else {
            content = (
              <span
                className={cn('font-bold', isCurrent ? 'text-white' : isCompleted ? 'text-green-700' : 'text-gray-500')}
              >
                {idx + 1}
              </span>
            )
          }
          return (
            <li key={item.key} className={cn('mb-10 ms-6', idx === items.length - 1 && 'mb-0')}>
              <span
                className={cn(
                  'absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 ring-8 ring-white dark:ring-gray-900',
                  getStepColor(idx, item),
                )}
              >
                {content}
              </span>
              <h3 className="flex items-center mb-1 text-xs font-semibold text-gray-900 dark:text-white">
                {item.label}
              </h3>
              {item.time && (
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {item.time}
                </time>
              )}
              {item.action}
            </li>
          )
        })}
      </ol>
    )
  }

  // Horizontal (default)
  return (
    <ol className={cn('flex items-center', className)}>
      {items.map((item, idx) => {
        const isCurrent = idx === currentIdx || item.status === 'in-progress'
        const isCompleted = idx < currentIdx || item.status === 'completed'
        const isError = item.key === 'CANCEL' || item.key === 'NO_DEPOSIT'
        let content: React.ReactNode
        if (item.key === 'CONTRACT_SIGNED') {
          content = <Car size={24} />
        } else if (isError) {
          content = <Ban size={24} />
        } else {
          content = (
            <span
              className={cn('font-bold', isCurrent ? 'text-white' : isCompleted ? 'text-green-700' : 'text-gray-500')}
            >
              {idx + 1}
            </span>
          )
        }
        return (
          <li key={item.key} className={cn('flex-1 min-w-0 flex flex-col items-center mb-6 sm:mb-0')}>
            <div className="flex items-center w-full">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full ring-0 ring-white shrink-0',
                  getStepColor(idx, item),
                  'sm:ring-8 dark:sm:ring-gray-900',
                )}
              >
                {content}
              </div>
              {idx < items.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5',
                    isCurrent || isCompleted ? 'bg-primary' : 'bg-gray-200',
                    'dark:bg-gray-700',
                  )}
                />
              )}
            </div>
            <div className="mt-3 sm:pe-8 w-full">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.label}</h3>
              {item.time && (
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {item.time}
                </time>
              )}
              {item.action}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
