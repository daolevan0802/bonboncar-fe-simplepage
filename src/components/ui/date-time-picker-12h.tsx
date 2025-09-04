import React from 'react'
import { format } from 'date-fns'

import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimePicker12 } from '@/components/ui/time-picker-12h'

interface DateTimePicker12hProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  label?: string
  disabled?: boolean
  required?: boolean
  className?: string
  minDate?: Date
}

export const DateTimePicker12h: React.FC<DateTimePicker12hProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  required = false,
  className,
  minDate,
}) => {
  // Tách ngày và giờ từ value
  const [date, setDate] = React.useState<Date | undefined>(value)
  React.useEffect(() => {
    setDate(value)
  }, [value])

  // Khi chọn ngày, giữ lại giờ/phút/giây cũ
  const handleDateChange = (d: Date | undefined) => {
    if (!d) {
      setDate(undefined)
      onChange(undefined)
      return
    }
    const newDate = new Date(d)
    if (date) {
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
      newDate.setSeconds(date.getSeconds())
    }
    setDate(newDate)
    onChange(newDate)
  }

  // Khi chọn giờ, giữ lại ngày cũ
  const handleTimeChange = (t: Date | undefined) => {
    if (!t) {
      setDate(undefined)
      onChange(undefined)
      return
    }
    const newDate = date ? new Date(date) : new Date()
    newDate.setHours(t.getHours())
    newDate.setMinutes(t.getMinutes())
    newDate.setSeconds(t.getSeconds())
    setDate(newDate)
    onChange(newDate)
  }

  // Hàm disable ngày nhỏ hơn minDate
  const disableBeforeMinDate = minDate ? (date: Date) => date < minDate : undefined

  return (
    <div className={className}>
      {label && (
        <Label className="mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Input
              readOnly
              className="cursor-pointer w-[140px]"
              value={date ? format(date, 'dd/MM/yyyy') : ''}
              placeholder="Chọn ngày"
              disabled={disabled}
            />
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              disabled={disabled || disableBeforeMinDate}
            />
          </PopoverContent>
        </Popover>
        <TimePicker12 date={date} setDate={handleTimeChange} />
      </div>
    </div>
  )
}
