import z from 'zod'

export const BookingStatusEnum = z.enum([
  'ALL',
  'DRAFT',
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'BOOKED',
  'VERIFYING',
  'VERIFIED',
  'CONTRACT_SIGNED',
  'DEPOSIT',
  'ISBOOKING',
  'RENTER_CHECKED_OUT',
  'HOST_CHECKED_OUT',
  'FEE_VERIFIED',
  'COMPLETED',
  'CANCEL',
  'NO_DEPOSIT',
  'HOST_VERIFIED',
  'RENTER_VERIFIED',
])

// Frontend enum keys (what the UI uses)
export const FrontendBookingStatus = {
  ALL: 'ALL',
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  BOOKED: 'BOOKED',
  VERIFYING: 'VERIFYING',
  VERIFIED: 'VERIFIED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  DEPOSIT: 'DEPOSIT',
  ISBOOKING: 'ISBOOKING',
  RENTER_CHECKED_OUT: 'RENTER_CHECKED_OUT',
  HOST_CHECKED_OUT: 'HOST_CHECKED_OUT',
  FEE_VERIFIED: 'FEE_VERIFIED',
  COMPLETED: 'COMPLETED',
  CANCEL: 'CANCEL',
  NO_DEPOSIT: 'NO_DEPOSIT',
  HOST_VERIFIED: 'HOST_VERIFIED',
  RENTER_VERIFIED: 'RENTER_VERIFIED',
} as const

// Mapping from frontend keys to backend values
export const frontendToBackendStatus = FrontendBookingStatus

// Mapping from backend values to frontend keys
export const backendToFrontendStatus = Object.fromEntries(
  Object.entries(FrontendBookingStatus).map(([key, value]) => [value, key]),
) as Record<string, keyof typeof FrontendBookingStatus>

export const FeeTypeEnum = z.enum([
  'BOOKING_FEE',
  'VAT',
  'SURCHARGE',
  'HOLD_CAR',
  'INSURANCE_FEE',
  'DISCOUNT_PROMOTION',
  'DEPOSIT',
  'INSURANCE_FEE_WITHOUT_VAT',
  'RENTER_COMMISSION',
  'DISCOUNT_SYSTEM',
  'HOLIDAY_MARKUP',
  'MARKUP',
  'TOTAL_AMOUNT_TO_PAY',
])

export const DeliveryOptionEnum = z.enum(['Customer pick up', 'Delivery to Customer', 'Two way delivery'])

export const BookingTypeEnum = z.enum(['SELF_DRIVE', 'WITH_DRIVER'])

export const PurposeEnum = z.enum(['Business', 'Vacation', 'Hometown visit', 'Others', 'Khác', 'Công tác'])

export const BookingFileCategoryEnum = z.enum([
  'DRIVER_LICENSE',
  'FACE_VERIFICATION',
  'HOST_DELIVERY',
  'RENTER_CHECKIN',
  'RENTER_CHECKOUT',
  'HOST_CONFIRM_FEE',
  'INSURANCE',
  'DOCUMENT_VERIFY',
  'FACE_VERIFY',
  'HOST_CHECKIN',
  'HOST_CHECKOUT',
])

// Frontend category display mapping
export const BookingFileCategoryDisplay = {
  DRIVER_LICENSE: 'Xác nhận GPLX',
  FACE_VERIFICATION: 'Xác nhận gương mặt',
  HOST_DELIVERY: 'Host giao xe',
  RENTER_CHECKIN: 'Renter nhận xe',
  RENTER_CHECKOUT: 'Renter trả xe',
  HOST_CONFIRM_FEE: 'Host xác nhận phí',
  INSURANCE: 'Bảo hiểm',
  DOCUMENT_VERIFY: 'Xác nhận tài liệu',
  FACE_VERIFY: 'Xác nhận gương mặt',
  HOST_CHECKIN: 'Host check in',
  HOST_CHECKOUT: 'Host check out',
} as const

export const PaymentTransactionTypeEnum = z.enum(['IN', 'OUT', 'CASHIN', 'CASHOUT'])

export const ApplyToEnum = z.enum(['HOST', 'RENTER'])

// Enum Type Inference
export type BookingStatus = z.infer<typeof BookingStatusEnum>
export type FeeType = z.infer<typeof FeeTypeEnum>
export type DeliveryOption = z.infer<typeof DeliveryOptionEnum>
export type BookingType = z.infer<typeof BookingTypeEnum>
export type Purpose = z.infer<typeof PurposeEnum>
export type BookingFileCategory = z.infer<typeof BookingFileCategoryEnum>
