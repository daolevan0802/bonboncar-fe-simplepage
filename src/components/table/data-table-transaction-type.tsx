import * as React from 'react'
import { Check, ChevronsUpDown, Filter } from 'lucide-react'
import z from 'zod'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useNavigate, useSearch } from '@tanstack/react-router'

interface DataTableTransactionTypeProps {
  title: string
  paramKey: string // key for the URL param
}

export const PaymentTransactionTypeEnum = z.enum(['CASHIN', 'CASHOUT'])

const typeLabels: Record<string, string> = {
  ALL: 'Tất cả',
  CASHIN: 'Tiền vào',
  CASHOUT: 'Tiền ra',
}

export function DataTableTransactionType({ title, paramKey }: DataTableTransactionTypeProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const [open, setOpen] = React.useState(false)

  // Get current value from search params
  const rawValue = search[paramKey as keyof typeof search]
  const currentValue = Array.isArray(rawValue) ? rawValue[0] : rawValue || ''

  // Use all type keys from typeLabels
  const options = ['ALL', ...PaymentTransactionTypeEnum.options]

  const handleSelect = (value: string) => {
    setOpen(false)
    const newValue = value === currentValue ? undefined : value
    navigate({
      to: '.',
      search: {
        ...search,
        [paramKey]: newValue ? [newValue] : undefined,
        page: 1,
      },
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button aria-label={`Toggle ${title}`} role="combobox" variant="outline" size="sm" className="border-dashed">
          <Filter />
          <span className="truncate">{typeLabels[currentValue || 'ALL'] ?? title}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder={`Tìm kiếm ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Không tìm thấy loại.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} onSelect={() => handleSelect(option)}>
                  <span className="truncate">{typeLabels[option]}</span>
                  <Check
                    className={cn('ml-auto size-4 shrink-0', currentValue === option ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
