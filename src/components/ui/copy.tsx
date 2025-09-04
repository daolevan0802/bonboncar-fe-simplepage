import * as React from 'react'
import { Copy as CopyIcon } from 'lucide-react'

export interface CopyProps {
  value: string
  className?: string
  children?: React.ReactNode
}

export function Copy({ value, className, children }: CopyProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(value)
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      {children ?? value}
      <CopyIcon
        size={16}
        style={{ marginLeft: 4, color: copied ? 'green' : undefined }}
        onClick={handleCopy}
        aria-label="Copy"
      />
    </span>
  )
}
