import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  [key: string]: any
}

interface ComboboxProps {
  options: Array<ComboboxOption>
  value: string
  onChange: (value: string) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  loading?: boolean
  placeholder?: string
  renderItem?: (option: ComboboxOption, selected: boolean) => React.ReactNode
  noOptionsMessage?: string
  onSelectOption?: (option: ComboboxOption) => void
  disabled?: boolean
  className?: string
  dropdownFooter?: React.ReactNode
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  inputValue,
  onInputChange,
  loading = false,
  placeholder = 'Chọn...',
  renderItem,
  noOptionsMessage = 'Không có lựa chọn.',
  onSelectOption,
  disabled = false,
  className,
  dropdownFooter,
}) => {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between text-muted-foreground font-normal', className)}
          disabled={disabled}
        >
          {selected ? selected.label : inputValue || placeholder}
          <ChevronsUpDown className="opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn('w-full min-w-[350px] p-0')}>
        <Command>
          <CommandInput placeholder="Tìm kiếm..." className="h-9" value={inputValue} onValueChange={onInputChange} />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">Đang tải...</div>
            )}
            {!loading && options.length === 0 && <CommandEmpty>{noOptionsMessage}</CommandEmpty>}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                    onSelectOption?.(option)
                  }}
                  disabled={option.disabled}
                >
                  {renderItem ? (
                    renderItem(option, value === option.value)
                  ) : (
                    <>
                      {option.label}
                      <Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {dropdownFooter && <div>{dropdownFooter}</div>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
