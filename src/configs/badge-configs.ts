import type { BookingStatus, BookingType, DeliveryOption, Purpose } from '@/schemas/enum.schemas'
import { BookingTypeDisplay, DeliveryOptionDisplay, PurposeDisplay } from '@/schemas/enum.schemas'
import { statusColors, statusDisplay } from '@/types/display.type'

// Status color mapping
export const getStatusColor = (status: BookingStatus): string => {
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Status display mapping
export const getStatusDisplay = (status: BookingStatus): string => {
  return statusDisplay[status] || status
}

// Client booking count color mapping
export const getClientBookingCountColor = (count: number): string => {
  if (count < 2) {
    return 'bg-green-100 text-green-800 border-green-200'
  }
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

// Client booking count display mapping
export const getClientBookingCountDisplay = (count: number): string => {
  if (count < 2) {
    return 'Mới'
  }
  return 'Cũ'
}

// Client verification color mapping
export const getClientVerificationColor = (isVerified: boolean): string => {
  if (isVerified) {
    return 'bg-green-100 text-green-800 border-green-200'
  }
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

// Client verification display mapping
export const getClientVerificationDisplay = (isVerified: boolean): string => {
  if (isVerified) {
    return 'Đã xác minh'
  }
  return 'Chưa xác minh'
}

// VAT export color mapping
export const getVatExportColor = (isExportVat: boolean): string => {
  if (isExportVat) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

// VAT export display mapping
export const getVatExportDisplay = (isExportVat: boolean): string => {
  if (isExportVat) {
    return 'Có'
  }
  return 'Không'
}

// No license point color mapping
export const getNoLicensePointColor = (isNoLicensePoint: boolean): string => {
  if (isNoLicensePoint) {
    return 'bg-red-100 text-red-800 border-red-200'
  }
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

// No license point display mapping
export const getNoLicensePointDisplay = (isNoLicensePoint: boolean): string => {
  if (isNoLicensePoint) {
    return 'Có'
  }
  return 'Không'
}

// Platform color mapping
export const getPlatformColor = (): string => {
  return 'bg-purple-100 text-purple-800 border-purple-200'
}

// Delivery option display mapping
export const getDeliveryOptionDisplay = (option: DeliveryOption): string => {
  return DeliveryOptionDisplay[option] || option
}

// Delivery option color mapping
export const getDeliveryOptionColor = (): string => {
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

// Booking type display mapping
export const getBookingTypeDisplay = (type: BookingType): string => {
  return BookingTypeDisplay[type] || type
}

// Booking type color mapping
export const getBookingTypeColor = (): string => {
  return 'bg-green-100 text-green-800 border-green-200'
}

// Purpose display mapping
export const getPurposeDisplay = (purpose: Purpose): string => {
  return PurposeDisplay[purpose] || purpose
}

// Purpose color mapping
export const getPurposeColor = (): string => {
  return 'bg-orange-100 text-orange-800 border-orange-200'
}
