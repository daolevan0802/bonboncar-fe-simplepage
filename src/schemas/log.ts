import type z from 'zod'

/**
 * Validate data với schema Zod, nếu lỗi thì log và trả về data gốc (hoặc fallback).
 * @param schema Zod schema
 * @param data Dữ liệu cần validate
 * @param context (optional) Chuỗi mô tả ngữ cảnh để log
 * @param fallback (optional) Giá trị trả về nếu lỗi, mặc định là data gốc
 * @returns data đã parse nếu hợp lệ, ngược lại trả về fallback/data gốc
 * @example
 *   const data = parseAndLog(MySchema, response.data, 'fetch my data')
 */
export function parseAndLog<T>(schema: z.ZodType<T>, data: unknown, context?: string, fallback?: any): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    // Log lỗi chi tiết nếu là ZodError
    const error = result.error
    const details = error.issues.map((e: z.ZodIssue) => ({
      path: e.path.join('.'),
      message: e.message,
      expected: (e as any).expected,
      received: (e as any).received,
      code: e.code,
    }))
    if (context) {
      console.error(`[ZodError] ${context}:`, details)
    } else {
      console.error('[ZodError]:', details)
    }
    // Trả về fallback nếu có, không thì trả về data gốc
    return fallback !== undefined ? fallback : (data as T)
  }
  return result.data
}
