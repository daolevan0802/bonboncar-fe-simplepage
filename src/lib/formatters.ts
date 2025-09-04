import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Format currency - handle null/undefined values
export const formatCurrency = (amount: number | null | undefined): string => {
  const safeAmount = typeof amount === 'number' ? amount : 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(safeAmount)
}

// Format date - handle null/undefined/invalid dates
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
  } catch {
    return dateString || '-'
  }
}

// Format date only (without time)
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return format(date, 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateString || '-'
  }
}

// Format time only
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return format(date, 'HH:mm', { locale: vi })
  } catch {
    return dateString || '-'
  }
}

// Format to lowercase with fallback
export const formatToLowerCase = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return String(value).toLowerCase()
}

// Safe value getter - handle null/undefined values
export const getSafeValue = (value: unknown, fallback: string = '-'): string => {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

// Format phone number with Vietnamese format
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '-'
  const cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Format number with Vietnamese locale
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '-'
  return new Intl.NumberFormat('vi-VN').format(num)
}

// Format percentage
export const formatPercentage = (value: number | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined) return '-'
  return `${value.toFixed(decimals)}%`
}

// Truncate text with ellipsis
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Format file size
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return '-'
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Format duration in minutes to human readable
export const formatDuration = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) return '-'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} phút`
  }

  if (remainingMinutes === 0) {
    return `${hours} giờ`
  }

  return `${hours} giờ ${remainingMinutes} phút`
}
