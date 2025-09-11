import { z } from 'zod'

const DeliveryFeeConditionValueSchema = z.object({
  minDeliveryFee: z.number(),
  feePerKm: z.number(),
  distanceMultiplier: z.number(),
  minDistanceForDiscount: z.number(),
  maxDistanceForDiscount: z.number(),
  minBookingPriceForDiscount: z.number(),
  discountPercent: z.number(),
})

const CleaningConditionValueSchema = z.object({
  Sedan5: z.number(),
  SUV5: z.number(),
  SUV7: z.number(),
  MPV7: z.number(),
  HatchBack: z.number(),
  MiniVan: z.number(),
  BanTai: z.number(),
})

const LateReturnConditionValueSchema = z.object({
  percentageOfRent24Hour: z.number(),
})

const CancellationConditionValueSchema = z.object({
  percentageOfRent: z.number(),
})

const ConditionValueSchema = z.union([
  DeliveryFeeConditionValueSchema,
  CleaningConditionValueSchema,
  LateReturnConditionValueSchema,
  CancellationConditionValueSchema,
  z.object({}).passthrough(),
  z.null(),
])

const SurchargeSchema = z.object({
  id: z.number(),
  code: z.string(),
  surcharge_name: z.string(),
  apply_to: z.string(),
  default_value: z.string(),
  uom: z.string(),
  apply_type: z.string(),
  condition_value: ConditionValueSchema,
  type: z.string(),
  is_active: z.boolean(),
  is_included_vat: z.boolean(),
  charge_vat: z.boolean(),
  vat_percent: z.union([z.number(), z.null()]),
  order: z.number(),
})

const MetaSurchargeListResponseSchema = z.object({
  total: z.number(),
  count: z.number(),
  pageSize: z.number(),
  skip: z.number(),
  totalPages: z.number(),
})

export const SurchargeListResponseSchema = z.object({
  data: z.array(SurchargeSchema),
  meta: MetaSurchargeListResponseSchema,
})

export type SurchargeListResponse = z.infer<typeof SurchargeListResponseSchema>
export type Surcharge = z.infer<typeof SurchargeSchema>
export type ConditionValue = z.infer<typeof ConditionValueSchema>

export const SurchargeFilterSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
})

export type SurchargeFilter = z.infer<typeof SurchargeFilterSchema>

export const SurchargeItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  surcharge_name: z.string(),
  apply_to: z.string(),
  default_value: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) || 0 : val)),
  uom: z.string(),
  apply_type: z.string(),
  condition_value: ConditionValueSchema,
  type: z.string(),
  is_active: z.boolean(),
  is_included_vat: z.boolean(),
  charge_vat: z.boolean(),
  vat_percent: z.union([z.number(), z.null()]),
  order: z.number(),
})

export const SurchargeMetaSchema = z.object({
  id: z.number(),
  code: z.string(),
  surcharge_name: z.string(),
  type: z.string(),
  is_active: z.boolean(),
})

export const SurchargeDetailResponseSchema = z.object({
  data: SurchargeItemSchema,
  meta: SurchargeMetaSchema,
})

export type SurchargeDetailResponse = z.infer<typeof SurchargeDetailResponseSchema>
export type SurchargeItem = z.infer<typeof SurchargeItemSchema>
export type SurchargeMeta = z.infer<typeof SurchargeMetaSchema>
export type DeliveryFeeConditionValue = z.infer<typeof DeliveryFeeConditionValueSchema>

// Định nghĩa các enum để tái sử dụng và giúp code rõ ràng hơn
export const ApplyToEnum = z.enum(['HOST', 'RENTER'])

export const ApplyTypeEnum = z.enum(['BASIC', 'ADVANCED'])

export const SurchargeTypeEnum = z.enum(['POST', 'PRE', 'CANCEL'])

export const UpdateSurchargeSchema = z.object({
  code: z.string().min(1, { message: "Trường 'code' không được để trống" }),
  surcharge_name: z.string().min(1, { message: "Trường 'surcharge_name' không được để trống" }),
  apply_to: ApplyToEnum,
  default_value: z.number().min(0, { message: "Giá trị mặc định 'default_value' phải lớn hơn hoặc bằng 0" }).optional(),
  uom: z.string().min(1, { message: "Đơn vị 'uom' không được để trống" }),
  apply_type: ApplyTypeEnum,
  condition_value: z.record(z.string(), z.any()).nullable().optional(),
  type: SurchargeTypeEnum,
  is_active: z.boolean(),
  is_included_vat: z.boolean(),
  charge_vat: z.boolean(),
  vat_percent: z
    .number()
    .min(0, { message: "Phần trăm VAT 'vat_percent' phải từ 0" })
    .max(100, { message: "Phần trăm VAT 'vat_percent' phải đến 100" })
    .nullable(),
  order: z.number().int().min(0, { message: "Thứ tự 'order' phải là số nguyên lớn hơn hoặc bằng 0" }),
  meta: z.any().optional(),
})

export const PartialUpdateSurchargeRequestSchema = UpdateSurchargeSchema.partial()

export const UpdateSurchargeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: SurchargeItemSchema,
})

export type UpdateSurchargeRequest = z.infer<typeof UpdateSurchargeSchema>
export type PartialUpdateSurchargeRequest = z.infer<typeof PartialUpdateSurchargeRequestSchema>
export type UpdateSurchargeResponse = z.infer<typeof UpdateSurchargeResponseSchema>
