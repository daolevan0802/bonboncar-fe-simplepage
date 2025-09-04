import { z } from 'zod'

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

// Referrer Schema
export const ReferrerSchema = z.object({
  id: numberOrStringToNumber,
  name: parseStringOrEmpty,
  referralCode: parseStringOrEmpty,
  email: parseStringOrEmpty.optional(),
  phone: parseStringOrEmpty.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  totalBookings: z.number().default(0),
  totalRevenue: z.number().default(0),
})

// TypeScript types derived from schemas
export type Referrer = z.infer<typeof ReferrerSchema>

// Export schema for validation
export default ReferrerSchema
