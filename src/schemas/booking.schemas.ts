import { z } from 'zod'

import {
  ApplyToEnum,
  BookingFileCategoryEnum,
  BookingStatusEnum,
  DeliveryOptionEnum,
  FeeTypeEnum,
  FrontendBookingStatus,
  PaymentTransactionTypeEnum,
  PurposeEnum,
} from '@/schemas/enum.schemas'

// Helper function to handle string/number conversion with nulls
const numberOrStringToNumber = z.union([
  z.number(),
  z.string().transform((val) => {
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }),
  z.null().transform(() => 0),
])

// Helper: parse null/undefined to '' for string
const parseStringOrEmpty = z.preprocess((val) => (val === null || val === undefined ? '' : val), z.string())

// Helper: parse null/undefined to false for boolean
const parseBooleanOrFalse = z.preprocess((val) => (val === null || val === undefined ? false : val), z.boolean())

// Helper: parse string/number/null/undefined to number or null
const parseNumberOrNull = z.preprocess((val) => {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'string') return val === '' ? null : Number(val)
  return val
}, z.number().nullable())

const numberOrStringToString = z.preprocess((val) => {
  if (val === null || val === undefined || val === '') return ''
  if (typeof val === 'string') return val
  return val.toString()
}, z.string())

// Client Info Schema
export const ClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  bank_name: z.string().nullable().optional(),
  bank_number: z.string().nullable().optional(),
  bank_username: z.string().nullable().optional(),
})

// Booking Detail (Fee Item) Schema
export const BookingDetailSchema = z.object({
  id: z.number().optional(),
  apply_to: z.string(),
  fee_type: FeeTypeEnum,
  more_info: z
    .object({
      surcharge_code: z.string().optional(),
      promotion_code: z.string().optional(),
      renter_commision: z.number().optional().nullable(),
    })
    .nullable()
    .optional(),
  value: numberOrStringToNumber,
  vat_percent: numberOrStringToString,
  description: z.string().optional().nullable(),
  booking_id: z.number().optional(),
  host_commission: numberOrStringToNumber.optional(),
  order: z.number().optional(),
})

// Booking File Schema
export const BookingFileSchema = z.object({
  id: z.number().optional(),
  booking_id: z.number().optional(),
  name: z.string().optional(),
  folder_path: z.string().optional(),
  size: numberOrStringToNumber.optional(),
  extension: z.string().optional().nullable(),
  url: z.string().optional(),
  category: BookingFileCategoryEnum.optional().nullable(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Payment Transaction Schema
export const PaymentTransactionSchema = z.object({
  id: z.number(),
  type: PaymentTransactionTypeEnum,
  status: z.string(),
  payment_type: z.string().nullable(),
  source: z.string().nullable(),
  remitter_account: z.string().nullable(),
  beneficiary_account: z.string().nullable(),
  note: z.string().nullable(),
  amount: z.string().nullable(),
  for: z.string().nullable(),
  reference_id: z.string().nullable(),
  receiver: z.string().nullable(),
  sender: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().nullable(),
})

// Booking Transaction Schema
export const BookingTransactionSchema = z.object({
  id: z.number(),
  apply_to: ApplyToEnum,
  booking_id: z.number(),
  transaction_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  booking_detail_id: z.number().nullable(),
  payment_type: z.string().nullable(),
  payment_transaction: PaymentTransactionSchema.optional(),
})

// Filter Booking Request Schema with status transformation
export const BookingFilterSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  orderBy: z.record(z.string(), z.string()).default({ id: 'DESC' }),
  filters: z
    .object({
      status: z.array(z.enum(Object.keys(FrontendBookingStatus) as [string, ...Array<string>])).optional(),
      is_hold_car_after_cancel: z.boolean().optional(),
      filterSearch: z.string().optional(),
    })
    .optional(),
})

// 1. Tạo CarRentInfoSchema dựa trên các schema con đã dùng
export const CarRentInfoSchema = z
  .object({
    normal_hour: parseNumberOrNull,
    rent_1_hour: parseNumberOrNull,
    rent_4_hour: parseNumberOrNull,
    rent_8_hour: parseNumberOrNull,
    vat_percent: numberOrStringToString,
    holiday_hour: parseNumberOrNull,
    rent_12_hour: parseNumberOrNull,
    rent_24_hour: parseNumberOrNull,
    rent_holiday: parseNumberOrNull,
    host_commission: parseNumberOrNull,
    renter_commission: parseNumberOrNull,
    weekend_surcharge: parseNumberOrNull,
    min_booking_in_holiday: parseNumberOrNull,
  })
  .partial()

// --- Base Booking Fields Schema ---
const BaseBookingFieldsSchema = z.object({
  id: numberOrStringToNumber,
  booking_id: numberOrStringToNumber,
  scheduled_pickup_timestamp: z.string(),
  scheduled_return_timestamp: z.string(),
  count_time: z.string(),
  car_sku: z.string(),
  amount_to_pay: numberOrStringToNumber,
  phone_number: z.string(),
  user_name: z.string(),
  status: z.string(),
  reason_of_cancel: parseStringOrEmpty,
  booking_type: z.string().optional().nullable(),
  discount: numberOrStringToNumber,
  delivery_option: z.string(),
  delivery_address_to_cust: z.string().optional().nullable(),
  delivery_address_from_cust: z.string().optional().nullable(),
  lat: numberOrStringToNumber,
  lng: numberOrStringToNumber,
  return_lat: numberOrStringToNumber,
  return_lng: numberOrStringToNumber,
  rental_amount: numberOrStringToNumber,
  delivery_fee_amount_to_customer: numberOrStringToNumber,
  deposit_amount: numberOrStringToNumber,
  vat: numberOrStringToNumber,
  platform: z.string().optional().nullable(),
  promotion_code: z.string().optional(),
  tag: z.string().optional().nullable(),
  user_city: z.string().optional().nullable(),
  is_export_vat: z.boolean().optional(),
  company_name: z.string().optional().nullable(),
  company_address: z.string().optional().nullable(),
  company_tax_code: z.string().optional().nullable(),
  company_email: z.string().optional().nullable(),
  filters: z
    .object({
      status: z.array(z.enum(Object.keys(FrontendBookingStatus) as [string, ...Array<string>])).optional(),
      is_hold_car_after_cancel: z.boolean().optional(),
      filterSearch: z.string().optional(),
    })
    .optional()
    .nullable(),
  purpose: z.string().optional().nullable(),
  itinerary: z.string().optional().nullable(),
  client_id: z.number().optional(),
  renter_checkin_time: z.string().optional().nullable(),
  renter_checkout_time: z.string().optional().nullable(),
  car_rent_info: CarRentInfoSchema.nullable().optional(),
  license_point: z.string().optional().nullable(),
  is_no_license_point: z.boolean().optional().nullable(),
  version: numberOrStringToNumber,
  created_at: z.string(),
  updated_at: z.string().optional(),
  is_hold_car_after_cancel: z.boolean().optional(),
  is_bonbon_pickup_delivery: z.boolean().optional(),
  is_bonbon_return_delivery: z.boolean().optional(),
})

// Main Booking Schema with robust null/undefined/type handling
export const BookingSchema = BaseBookingFieldsSchema.extend({
  status: BookingStatusEnum.catch('DRAFT'),
  booking_type: z.string().optional().nullable(),
  delivery_option: DeliveryOptionEnum.catch('Customer pick up'),
  platform: z.string().catch('WEB').nullable().optional(),
  promotion_code: z.string().catch(''),
  purpose: PurposeEnum.catch('Others'),
  client_id: z.number().catch(0),
  itinerary: z.string().catch(''),
  is_export_vat: z.boolean().catch(false),
  booking_details: z.array(BookingDetailSchema).optional().default([]),
  booking_transactions: z.array(BookingTransactionSchema).optional().default([]),
  booking_files: z.array(BookingFileSchema).optional().default([]).nullable(),
  client: ClientSchema.nullable().optional(),
  count_client_booking: z.number().optional(),
})

// --- Car Types ---
export const CarPhotoFormatsSchema = z
  .object({
    medium: z.object({ url: z.string().nullable() }).partial().optional(),
    thumbnail: z.object({ url: z.string().nullable() }).partial().optional(),
    small: z.object({ url: z.string().nullable() }).partial().optional(),
    large: z.object({ url: z.string().nullable() }).partial().optional(),
  })
  .partial()

export const CarPhotosSchema = z
  .object({
    id: z.number().optional(),
    Main_Photo: z
      .object({
        formats: CarPhotoFormatsSchema.optional(),
      })
      .partial()
      .optional(),
  })
  .partial()

export const CarRentSchema = z
  .object({
    id: z.number().optional(),
    Rent_1_hour: z.string().nullable().optional(),
    Rent_4_hour: z.string().nullable().optional(),
    Rent_8_hour: z.string().nullable().optional(),
    Rent_12_hour: z.string().nullable().optional(),
    Rent_24_hour: z.string().nullable().optional(),
    host_commission: z.number().nullable().optional(),
    rate_in_holiday: z.string().nullable().optional(),
    renter_commision: z.number().nullable().optional(),
    Weekend_surcharge: z.string().nullable().optional(),
    min_booking_in_holiday: parseNumberOrNull,
    over_km_fee_commission: parseNumberOrNull,
    late_return_fee_commission: parseNumberOrNull,
    cancellation_fee_commission: z.number().nullable().optional(),
    ev_electric_charge_commission: parseNumberOrNull,
    bbc_revenue_from_damage_commission: parseNumberOrNull,
    fuel_collected_from_cust_commission: z.number().nullable().optional(),
    vetc_collected_from_cust_commission: z.number().nullable().optional(),
    damage_collected_from_cust_commission: z.number().nullable().optional(),
    cleaning_collected_from_cust_commission: z.number().nullable().optional(),
    parking_fee_to_refund_customer_commission: z.string().nullable().optional(),
    delivery_fee_amount_to_customer_commission: z.number().nullable().optional(),
    delivery_fee_amount_from_customer_commission: z.number().nullable().optional(),
  })
  .partial()

export const CarInfoSchema = z
  .object({
    id: z.number().optional(),
    etc: z.boolean().optional(),
    gps: z.boolean().optional(),
    map: z.boolean().optional(),
    usb: z.boolean().optional(),
    airbag: z.boolean().optional(),
    dashcam: z.boolean().optional(),
    sunroof: z.boolean().optional(),
    bluetooth: z.boolean().optional(),
    fuel_type: z.string().nullable().optional(),
    camera_360: z.boolean().optional(),
    dvd_player: z.boolean().optional(),
    spare_tyre: z.boolean().optional(),
    fuel_economy: z.string().nullable().optional(),
    impact_sensor: z.boolean().optional(),
    speed_warning: z.boolean().optional(),
    reverse_camera: z.boolean().optional(),
    car_description: z.string().nullable().optional(),
    side_view_camera: z.boolean().optional(),
    tire_pressure_monitoring_system: z.boolean().optional(),
  })
  .partial()

export const CarInternalSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    expire_day: z.string().nullable().optional(),
  })
  .partial()

export const CarCreatedBySchema = z
  .object({
    id: z.number().optional(),
    email: z.string().optional(),
    blocked: z.boolean().optional(),
    isActive: z.boolean().optional(),
    lastname: z.string().optional(),
    password: z.string().optional(),
    username: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    firstname: z.string().optional(),
    updatedAt: z.string().optional(),
    preferedLanguage: z.string().nullable().optional(),
    registrationToken: z.string().nullable().optional(),
    resetPasswordToken: z.string().nullable().optional(),
  })
  .partial()

export const CarUpdatedBySchema = CarCreatedBySchema

export const CarSchema = z
  .object({
    id: z.number().optional(),
    Rent: CarRentSchema.optional(),
    Size: z.string().nullable().optional(),
    Mo_cop: z.string().nullable().optional(),
    Photos: CarPhotosSchema.optional(),
    Status: z.string().optional(),
    is_247: z.boolean().nullable().optional(),
    Cam_360: z.string().nullable().optional(),
    Cam_lui: z.string().nullable().optional(),
    CarPlay: z.string().nullable().optional(),
    Car_SKU: z.string().optional(),
    Vietmap: z.string().nullable().optional(),
    keyword: z.string().nullable().optional(),
    mapLink: z.string().nullable().optional(),
    District: z.string().nullable().optional(),
    car_info: CarInfoSchema.optional(),
    Car_Color: z.string().nullable().optional(),
    Car_Model: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    createdBy: CarCreatedBySchema.optional().nullable(),
    is_luxury: z.boolean().nullable().optional(),
    updatedAt: z.string().optional(),
    updatedBy: CarUpdatedBySchema.optional(),
    Usage_Note: z.string().nullable().optional(),
    Year_field: z.string().nullable().optional(),
    is_use_key: z.boolean().optional(),
    is_favorite: z.boolean().nullable().optional(),
    publishedAt: z.string().optional(),
    stake_money: z.string().nullable().optional(),
    Plate_Number: z.string().nullable().optional(),
    Transmission: z.string().nullable().optional(),
    car_internal: z.array(CarInternalSchema).optional(),
    electric_fee: z.string().nullable().optional(),
    main_photo_2: z.string().nullable().optional(),
    Cam_hanhtrinh: z.string().nullable().optional(),
    Short_location: z.string().nullable().optional(),
    Default_Station: z.string().nullable().optional(),
    Current_Parking_Location: z.string().nullable().optional(),
    Checkout_Parking_Instruction: z.string().nullable().optional(),
    car_city: z.string().nullable().optional(),
  })
  .partial()

// --- Client Type ---
export const ClientFullSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    string_fcm: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    reset_password_token: z.string().nullable().optional(),
    confirmation_token: z.string().nullable().optional(),
    confirmed: z.boolean().nullable().optional(),
    blocked: z.boolean().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    created_by_id: z.number().nullable().optional(),
    updated_by_id: z.number().nullable().optional(),
    address: z.string().nullable().optional(),
    // TODO: Định nghĩa schema cụ thể cho customer_info, reward, current_booking nếu có
    customer_info: z.unknown().nullable().optional(),
    cs_contact: z.string().nullable().optional(),
    bank_name: z.string().nullable().optional(),
    bank_number: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    reward: z.unknown().nullable().optional(),
    current_booking: z.unknown().nullable().optional(),
    emergency_name: z.string().nullable().optional(),
    emergency_phone: z.string().nullable().optional(),
    emergency_relation: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    ward: z.string().nullable().optional(),
    street: z.string().nullable().optional(),
    bank_username: z.string().nullable().optional(),
    is_confirm_decree_13: z.boolean().nullable().optional(),
    date_confirm_decree_13: z.string().nullable().optional(),
    ip_confirm_decree_13: z.string().nullable().optional(),
    identity_front_hash: z.string().nullable().optional(),
    face_hash: z.string().nullable().optional(),
  })
  .partial()

// Booking Detail (Full) Schema for booking detail API response
export const BookingDetailFullSchema = BaseBookingFieldsSchema.extend({
  amount_to_pay: parseNumberOrNull,
  discount: parseNumberOrNull,
  delivery_address_to_cust: parseStringOrEmpty,
  delivery_address_from_cust: parseStringOrEmpty,
  lat: parseNumberOrNull,
  lng: parseNumberOrNull,
  return_lat: parseNumberOrNull,
  return_lng: parseNumberOrNull,
  rental_amount: parseNumberOrNull,
  delivery_fee_amount_to_customer: parseNumberOrNull,
  deposit_amount: parseNumberOrNull,
  vat: parseNumberOrNull,
  promotion_code: parseStringOrEmpty,
  tag: parseStringOrEmpty,
  user_city: parseStringOrEmpty,
  is_export_vat: parseBooleanOrFalse,
  company_name: parseStringOrEmpty,
  company_address: parseStringOrEmpty,
  company_tax_code: parseStringOrEmpty,
  company_email: parseStringOrEmpty,
  purpose: parseStringOrEmpty,
  itinerary: parseStringOrEmpty,
  client_id: parseNumberOrNull,
  renter_checkin_time: parseStringOrEmpty,
  renter_checkout_time: parseStringOrEmpty,
  license_point: parseStringOrEmpty,
  is_no_license_point: parseBooleanOrFalse,
  is_hold_car_after_cancel: parseBooleanOrFalse,
  is_recalculated: parseBooleanOrFalse.optional(),
  car_rent_info: z
    .object({
      normal_hour: parseNumberOrNull,
      rent_1_hour: parseNumberOrNull,
      rent_4_hour: parseNumberOrNull,
      rent_8_hour: parseNumberOrNull,
      vat_percent: numberOrStringToString,
      holiday_hour: parseNumberOrNull,
      rent_12_hour: parseNumberOrNull,
      rent_24_hour: parseNumberOrNull,
      rent_holiday: parseNumberOrNull,
      host_commission: parseNumberOrNull,
      renter_commission: parseNumberOrNull,
      weekend_surcharge: parseNumberOrNull,
      min_booking_in_holiday: parseNumberOrNull,
    })
    .nullable()
    .optional(),
  booking_details: z.array(BookingDetailSchema).optional().default([]),
  booking_files: z.array(BookingFileSchema).optional().default([]).nullable(),
  booking_transactions: z.array(BookingTransactionSchema).optional().default([]),
  car_city: parseStringOrEmpty.optional(),
  car: CarSchema.optional().nullable(),
  total_refund: parseNumberOrNull.optional(),
  verify_status: parseStringOrEmpty.optional(),
  verify_docs_status: parseStringOrEmpty.optional(),
  check_out_parking_instruction: parseStringOrEmpty.optional(),
  client: ClientFullSchema.optional().nullable(),
  count_client_booking: parseNumberOrNull.optional(),
})

// CreateBookingResponseSchema.data sử dụng lại base, chỉ thêm các trường riêng biệt
export const CreateBookingResponseSchema = z.object({
  success: z.boolean(),
  data: BaseBookingFieldsSchema.extend({
    status: z.string(),
    delivery_option: z.string(),
    car_rent_info: z.object({
      rent_1_hour: z.number().nullable(),
      rent_4_hour: z.number().nullable(),
      rent_8_hour: z.number().nullable(),
      rent_12_hour: z.number().nullable(),
      rent_24_hour: z.number().nullable(),
      rent_holiday: z.number(),
      normal_hour: z.number(),
      holiday_hour: z.number().nullable(),
      weekend_surcharge: z.number().nullable(),
      min_booking_in_holiday: z.number(),
      vat_percent: numberOrStringToString,
      host_commission: z.number().nullable(),
      renter_commission: z.number().nullable(),
    }),
    insurance_product_code: z.string().nullable(),
    bookingDetails: z.array(BookingDetailSchema),
  }),
})

export const CreateBookingSchema = z.object({
  // Customer information
  phone_number: z.string().min(1, 'Số điện thoại là bắt buộc'),
  user_name: z.string().optional(),

  // Car and time information
  car_sku: z.string().min(1, 'Vui lòng chọn xe'),
  scheduled_pickup_timestamp: z.string().min(1, 'Vui lòng chọn thời gian lấy xe'),
  scheduled_return_timestamp: z.string().min(1, 'Vui lòng chọn thời gian trả xe'),

  // Delivery information
  delivery_option: z.enum(['Customer pick up', 'Delivery to Customer', 'Two way delivery']),
  location: z.string().optional(), // Required if delivery_option !== "Customer pick up"
  delivery_address_from_cust: z.string().optional().nullable(), // Required if delivery_option === "Two way delivery"
  delivery_address_to_cust: z.string().optional().nullable(), // Required if delivery_option === "Delivery to Customer"

  // Trip information
  itinerary: z.string().min(1, 'Nhập lộ trình'),
  purpose: PurposeEnum.optional(),
  promotion_code: z.string().optional(),

  // VAT information (conditional)
  is_export_vat: z.boolean().optional(),
  company_name: z.string().optional(), // Required if is_export_vat === true
  company_address: z.string().optional(), // Required if is_export_vat === true
  company_tax_code: z.string().optional(), // Required if is_export_vat === true
  company_email: z.string().optional(), // Required if is_export_vat === true

  // Coordinates (auto-generated)
  lat: z.number().optional(),
  lng: z.number().optional(),
  lat_return: z.number().optional(),
  lng_return: z.number().optional(),

  // Always set automatically
  booking_type: z.literal('cms'),
})

export const CarSkuListSchema = z.object({
  data: z.array(z.string()),
})

export const ClientSearchSchema = z.object({
  data: z.array(
    z.object({
      user_name: z.string().nullable(),
      phone_number: z.string(),
    }),
  ),
})

export const LocationSuggestionSchema = z.object({
  description: z.string(),
  place_id: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string(),
  }),
})

// Sign Contract
export const SignContractRequestSchema = z.object({
  is_from_cms: z.boolean(),
})

// Cancel Booking (already present as CancelBookingRequestSchema)
export const CancelBookingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

// Base API response for booking (re-added after refactor)
const BaseBookingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: BookingSchema,
})

export const VerifyFaceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

export const UnverifyFaceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

// Dùng lại cho các response booking
export const BookBookingResponseSchema = BaseBookingResponseSchema
export const SignContractResponseSchema = BaseBookingResponseSchema
export const DepositResponseSchema = BaseBookingResponseSchema
export const RenterCheckinResponseSchema = BaseBookingResponseSchema
export const RenterCheckoutResponseSchema = BaseBookingResponseSchema
export const HostCheckoutResponseSchema = BaseBookingResponseSchema
export const CompleteBookingResponseSchema = BaseBookingResponseSchema
export const ChangeStatusResponseSchema = BaseBookingResponseSchema

// API Meta Schema cho pagination
export const ApiMetaSchema = z.object({
  count: z.number(),
  pageSize: z.number(),
  skip: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

// Booking List Response Schema - cấu trúc API mới
export const BookingListResponseSchema = z.object({
  data: z
    .array(BookingSchema)
    .nullable()
    .default([])
    .transform((val) => val || []),
  meta: ApiMetaSchema,
})

export const UpdatedBookingFeeSchema = z.object({
  scheduled_pickup_timestamp: z.string().optional(),
  scheduled_return_timestamp: z.string().optional(),
  car_sku: z.string().optional(),
  delivery_option: DeliveryOptionEnum.optional(),
  delivery_address_to_cust: z.string().optional().nullable(),
  delivery_address_from_cust: z.string().optional().nullable(),
  promotion_code: z.string().optional(),
  is_bonbon_pickup_delivery: z.boolean().optional(),
  is_bonbon_return_delivery: z.boolean().optional(),
})

export const UpdateVatInfoSchema = z.object({
  is_export_vat: z.boolean(),
  company_name: z.string().optional(),
  company_address: z.string().optional(),
  company_tax_code: z.string().optional(),
  company_email: z.string().optional(),
})

export const UpdateLicenseInfoSchema = z.object({
  license_point: z.string().optional(),
  is_no_license_point: z.boolean().optional(),
})

export const UpdateTripInfoSchema = z.object({
  purpose: PurposeEnum,
  itinerary: z.string().optional(),
})

export const CancelBookingRequestSchema = z.object({
  cancel_fee_percentage: z.union([z.literal(0), z.literal(30), z.literal(100)]),
  is_no_deposit: z.boolean(),
  host_commission: z.string().optional(),
  reason_of_cancel: z.string().optional(),
})

export const ChangeStatusRequestSchema = z.object({
  status: BookingStatusEnum,
  reason: z.string().optional(),
})

export const ChangeClientRequestSchema = z.object({
  user_name: z.string(),
  phone_number: z.string(),
})

export const UpdateDepositRequestSchema = z.object({
  hold_car_amount: z.number(),
  deposit_amount: z.number(),
})

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.union([
    z.string(),
    z.object({
      message: z.union([z.string(), z.array(z.string())]),
    }),
  ]),
  status: z.number().optional(),
})

export const CreateBookingRequestSchema = z.object({
  car_sku: z.string(),
  scheduled_pickup_timestamp: z.string(),
  scheduled_return_timestamp: z.string(),
  user_name: z.string(),
  phone_number: z.string(),
  delivery_option: DeliveryOptionEnum,
  delivery_address_to_cust: z.string().optional().nullable(),
  delivery_address_from_cust: z.string().optional().nullable(),
  purpose: PurposeEnum.optional(),
  promotion_code: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  lat_return: z.number().optional(),
  lng_return: z.number().optional(),
})

export const FeeLineSchema = z.object({
  id: z.number().optional(),
  fee_type: z.string(),
  value: z.number(),
  vat_percent: z.number().optional(),
  host_commission: z.number().optional(),
  description: z.string().optional(),
})

export const FeeVerifyRequestSchema = z.object({
  booking_details: z.array(FeeLineSchema),
  deletedBookingDetailIds: z.array(z.number()).optional(),
})

export const FeeVerifyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: BookingDetailFullSchema.optional(),
})

export const FeeDraftUpdateRequestSchema = FeeVerifyRequestSchema
export const FeeDraftUpdateResponseSchema = FeeVerifyResponseSchema

// --- Types ---
// (Move all type exports to the end of the file, after all schema definitions)

export type Booking = z.infer<typeof BookingSchema>
export type BookingDetail = z.infer<typeof BookingDetailSchema>
export type BookingFile = z.infer<typeof BookingFileSchema>
export type BookingTransaction = z.infer<typeof BookingTransactionSchema>
export type Client = z.infer<typeof ClientSchema>
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>

export type BookingFilter = z.infer<typeof BookingFilterSchema>
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>
export type ApiMeta = z.infer<typeof ApiMetaSchema>
export type UpdatedBookingFee = z.infer<typeof UpdatedBookingFeeSchema>
export type UpdateVatInfo = z.infer<typeof UpdateVatInfoSchema>
export type UpdateLicenseInfo = z.infer<typeof UpdateLicenseInfoSchema>
export type UpdateTripInfo = z.infer<typeof UpdateTripInfoSchema>
export type CancelBookingRequest = z.infer<typeof CancelBookingRequestSchema>
export type ChangeStatusRequest = z.infer<typeof ChangeStatusRequestSchema>
export type ChangeClientRequest = z.infer<typeof ChangeClientRequestSchema>
export type UpdateDepositRequest = z.infer<typeof UpdateDepositRequestSchema>

export type BookBookingResponse = z.infer<typeof BookBookingResponseSchema>
export type SignContractRequest = z.infer<typeof SignContractRequestSchema>
export type SignContractResponse = z.infer<typeof SignContractResponseSchema>
export type DepositResponse = z.infer<typeof DepositResponseSchema>
export type RenterCheckinResponse = z.infer<typeof RenterCheckinResponseSchema>
export type RenterCheckoutResponse = z.infer<typeof RenterCheckoutResponseSchema>
export type HostCheckoutResponse = z.infer<typeof HostCheckoutResponseSchema>
export type CompleteBookingResponse = z.infer<typeof CompleteBookingResponseSchema>
export type CancelBookingResponse = z.infer<typeof CancelBookingResponseSchema>
export type ChangeStatusResponse = z.infer<typeof ChangeStatusResponseSchema>
export type VerifyFaceResponse = z.infer<typeof VerifyFaceResponseSchema>
export type UnverifyFaceResponse = z.infer<typeof UnverifyFaceResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export type BookingDetailFull = z.infer<typeof BookingDetailFullSchema>

// Type exports for create booking
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>
export type CarSkuList = z.infer<typeof CarSkuListSchema>
export type ClientSearch = z.infer<typeof ClientSearchSchema>
export type LocationSuggestion = z.infer<typeof LocationSuggestionSchema>
export type CreateBookingType = z.infer<typeof CreateBookingSchema>

export type Car = z.infer<typeof CarSchema>
export type ClientFull = z.infer<typeof ClientFullSchema>

export const UpdatedBookingFeeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: BookingDetailFullSchema.optional(),
})

export type UpdatedBookingFeeResponse = z.infer<typeof UpdatedBookingFeeResponseSchema>

export type FeeLine = z.infer<typeof FeeLineSchema>
export type FeeVerifyRequest = z.infer<typeof FeeVerifyRequestSchema>
export type FeeVerifyResponse = z.infer<typeof FeeVerifyResponseSchema>
export type FeeDraftUpdateRequest = z.infer<typeof FeeDraftUpdateRequestSchema>
export type FeeDraftUpdateResponse = z.infer<typeof FeeDraftUpdateResponseSchema>

// Schema for booking-info/cms (fee breakdown) API response
export const BookingFeeInfoItemSchema = z.object({
  apply_to: z.string(),
  fee_type: z.string(),
  value: z.string(),
  vat_percent: z.union([z.string(), z.number()]),
  host_commission: z.string().optional(),
  description: z.string().optional(),
  more_info: z.record(z.string(), z.any()).optional().nullable(),
  order: z.number().optional(),
})

export const BookingFeeInfoResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(BookingFeeInfoItemSchema),
})

export type BookingFeeInfoItem = z.infer<typeof BookingFeeInfoItemSchema>
export type BookingFeeInfoResponse = z.infer<typeof BookingFeeInfoResponseSchema>

export const HostVerifyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export const RenterVerifyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export type HostVerifyResponse = z.infer<typeof HostVerifyResponseSchema>
export type RenterVerifyResponse = z.infer<typeof RenterVerifyResponseSchema>
