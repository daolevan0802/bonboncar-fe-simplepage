import { z } from 'zod'

export const AffiliateFilterSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
})

export const CarRentInfoSchema = z.object({
  normal_hour: z.number(),
  rent_1_hour: z.number(),
  rent_4_hour: z.number(),
  rent_8_hour: z.number(),
  vat_percent: z.string(),
  holiday_hour: z.union([z.number(), z.null()]),
  rent_12_hour: z.number(),
  rent_24_hour: z.number(),
  rent_holiday: z.number(),
  host_commission: z.number(),
  renter_commission: z.number(),
  weekend_surcharge: z.number(),
  min_booking_in_holiday: z.number(),
})

export const BookingSchema = z.object({
  id: z.number(),
  booking_id: z.string(),
  scheduled_pickup_timestamp: z.string().datetime(),
  scheduled_return_timestamp: z.string().datetime(),
  count_time: z.string().datetime(),
  car_sku: z.string(),
  amount_to_pay: z.union([z.number(), z.null()]),
  phone_number: z.string(),
  user_name: z.string(),
  status: z.string(),
  reason_of_cancel: z.string(),
  booking_type: z.string(),
  discount: z.union([z.number(), z.null()]),
  delivery_option: z.string(),
  delivery_address_to_cust: z.union([z.string(), z.null()]),
  delivery_address_from_cust: z.union([z.string(), z.null()]),
  lat: z.union([z.number(), z.null()]),
  lng: z.union([z.number(), z.null()]),
  return_lat: z.union([z.number(), z.null()]),
  return_lng: z.union([z.number(), z.null()]),
  rental_amount: z.union([z.number(), z.null()]),
  delivery_fee_amount_to_customer: z.union([z.number(), z.null()]),
  deposit_amount: z.union([z.number(), z.null()]),
  vat: z.union([z.number(), z.null()]),
  platform: z.union([z.string(), z.null()]),
  promotion_code: z.union([z.string(), z.null()]),
  tag: z.union([z.string(), z.null()]),
  user_city: z.string(),
  is_export_vat: z.boolean(),
  company_name: z.union([z.string(), z.null()]),
  company_address: z.union([z.string(), z.null()]),
  company_tax_code: z.union([z.string(), z.null()]),
  company_email: z.union([z.string(), z.null()]),
  filters: z.union([z.string(), z.null()]), // Or a more specific schema if you know the structure
  purpose: z.union([z.string(), z.null()]),
  itinerary: z.union([z.string(), z.null()]),
  client_id: z.number(),
  renter_checkin_time: z.union([z.string().datetime(), z.null()]),
  renter_checkout_time: z.union([z.string().datetime(), z.null()]),
  car_rent_info: CarRentInfoSchema,
  license_point: z.union([z.number(), z.null()]),
  is_no_license_point: z.union([z.boolean(), z.null()]),
  version: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_hold_car_after_cancel: z.boolean(),
  is_recalculated: z.boolean(),
  is_bonbon_pickup_delivery: z.boolean(),
  is_bonbon_return_delivery: z.boolean(),
  insurance_product_code: z.string(),
  is_received_deposit: z.boolean(),
  status_before_cancel: z.union([z.string(), z.null()]),
})

export const AffiliateDataSchema = z.object({
  id: z.number(),
  affiliate_code: z.string(),
  affiliate_name: z.string(),
  affiliate_phone: z.string(),
  affiliate_email: z.string().email(),
  note: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  affiliate_logo: z.union([z.string(), z.null()]),
  city: z.union([z.string(), z.null()]),
  bookings: z.array(BookingSchema),
})

export const MetaSchema = z.object({
  total: z.number(),
  count: z.number(),
  pageSize: z.number(),
  skip: z.number(),
  totalPages: z.number(),
})

export const GetAffiliateResponseSchema = z.object({
  data: z.array(AffiliateDataSchema),
  meta: MetaSchema,
})

export type AffiliateFilter = z.infer<typeof AffiliateFilterSchema>
export type AffiliateData = z.infer<typeof AffiliateDataSchema>
export type Booking = z.infer<typeof BookingSchema>
export type GetAffiliateResponse = z.infer<typeof GetAffiliateResponseSchema>

export const GetAffiliateBookingsResponseSchema = z.object({
  data: z.array(BookingSchema),
  meta: MetaSchema,
})

export type GetAffiliateBookingsResponse = z.infer<typeof GetAffiliateBookingsResponseSchema>

export const AffiliateBookingsFilterSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
})

export type AffiliateBookingsFilter = z.infer<typeof AffiliateBookingsFilterSchema>

// Statistics schemas
export const AffiliateStatsSchema = z.object({
  totalAffiliates: z.number(),
  totalBookings: z.number(),
  totalRevenue: z.number(),
  totalCommission: z.number(),
  activeAffiliates: z.number(),
  topAffiliates: z.array(
    z.object({
      id: z.number(),
      affiliate_code: z.string(),
      affiliate_name: z.string(),
      totalBookings: z.number(),
      totalRevenue: z.number(),
      commission: z.number(),
    }),
  ),
  monthlyStats: z.array(
    z.object({
      month: z.string(),
      totalBookings: z.number(),
      totalRevenue: z.number(),
      newAffiliates: z.number(),
    }),
  ),
  bookingStatusStats: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
      percentage: z.number(),
    }),
  ),
  cityStats: z.array(
    z.object({
      city: z.string(),
      affiliateCount: z.number(),
      bookingCount: z.number(),
      revenue: z.number(),
    }),
  ),
})

export const AffiliateDashboardStatsSchema = z.object({
  overview: AffiliateStatsSchema,
  period: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
})

export type AffiliateStats = z.infer<typeof AffiliateStatsSchema>
export type AffiliateDashboardStats = z.infer<typeof AffiliateDashboardStatsSchema>

// DTOs for Affiliate Dashboard Stats
export const TopAffiliateDtoSchema = z.object({
  id: z.number(),
  affiliate_code: z.string(),
  affiliate_name: z.string(),
  totalBookings: z.number(),
  totalRevenue: z.number(),
  commission: z.number(),
})

export const MonthlyStatsDtoSchema = z.object({
  month: z.string(), // Hoặc z.string().regex(/^\d{4}-\d{2}$/) nếu bạn muốn định dạng YYYY-MM
  totalBookings: z.number(),
  totalRevenue: z.number(),
  newAffiliates: z.number(),
})

export const BookingStatusStatsDtoSchema = z.object({
  status: z.string(),
  count: z.number(),
  percentage: z.number(),
})

export const CityStatsDtoSchema = z.object({
  city: z.string(),
  affiliateCount: z.number(),
  bookingCount: z.number(),
  revenue: z.number(),
})

export const OverviewStatsDtoSchema = z.object({
  totalAffiliates: z.number(),
  totalBookings: z.number(),
  totalRevenue: z.number(),
  totalCommission: z.number(),
  activeAffiliates: z.number(),
  topAffiliates: z.array(TopAffiliateDtoSchema),
  monthlyStats: z.array(MonthlyStatsDtoSchema),
  bookingStatusStats: z.array(BookingStatusStatsDtoSchema),
  cityStats: z.array(CityStatsDtoSchema),
})

export const PeriodDtoSchema = z.object({
  startDate: z.string().datetime(), // Giả định là định dạng ISO 8601
  endDate: z.string().datetime(), // Giả định là định dạng ISO 8601
})

export const AffiliateDashboardResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    overview: OverviewStatsDtoSchema,
    period: PeriodDtoSchema,
  }),
})

// Types inference
export type TopAffiliateDto = z.infer<typeof TopAffiliateDtoSchema>
export type MonthlyStatsDto = z.infer<typeof MonthlyStatsDtoSchema>
export type BookingStatusStatsDto = z.infer<typeof BookingStatusStatsDtoSchema>
export type CityStatsDto = z.infer<typeof CityStatsDtoSchema>
export type OverviewStatsDto = z.infer<typeof OverviewStatsDtoSchema>
export type PeriodDto = z.infer<typeof PeriodDtoSchema>
export type AffiliateDashboardResponse = z.infer<typeof AffiliateDashboardResponseSchema>
