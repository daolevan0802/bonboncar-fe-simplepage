import { forwardRef, useState } from 'react'
import { XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type InputTagsProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: Array<string>
  onChange: (value: Array<string>) => void
}

const isValidPhone = (phone: string) => /^0\d{9}$/.test(phone)

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = useState('')
  const [error, setError] = useState('')

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      // Split by comma, space, or newline for paste support
      const parts = pendingDataPoint
        .split(/[\s,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      const invalid = parts.find((p) => !isValidPhone(p))
      if (invalid) {
        setError(`Số không hợp lệ: ${invalid}`)
        return
      }
      if (parts.length) {
        const newDataPoints = new Set([...value, ...parts])
        onChange(Array.from(newDataPoints))
        setPendingDataPoint('')
        setError('')
      }
    }
  }

  const handleClearAll = () => {
    onChange([])
    setError('')
  }

  return (
    <>
      <div className="flex">
        <Input
          value={pendingDataPoint}
          onChange={(e) => {
            setPendingDataPoint(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addPendingDataPoint()
            } else if (e.key === ',' || e.key === ' ') {
              e.preventDefault()
              addPendingDataPoint()
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            if (text && /[\s,\n]/.test(text)) {
              e.preventDefault()
              setPendingDataPoint(text)
              setTimeout(addPendingDataPoint, 0)
            }
          }}
          className="rounded-r-none"
          {...props}
          ref={ref}
        />

        <Button
          type="button"
          variant="ghost"
          className="rounded-l-none border border-l-0 text-xs px-2"
          onClick={handleClearAll}
        >
          <XIcon className="w-3" />
        </Button>
      </div>
      <div className="border rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
        {value.map((item: string, idx: number) => (
          <Badge key={idx} variant="secondary">
            {item}
            <button
              type="button"
              className="w-3 ml-2"
              onClick={() => {
                onChange(value.filter((i: string) => i !== item))
                setError('')
              }}
            >
              <XIcon className="w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </>
  )
})
InputTags.displayName = 'InputTags'
