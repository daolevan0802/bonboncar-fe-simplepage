import type { BookingListResponse } from '@/schemas/booking.schemas'

/**
 * Transform API response với meta sang format cũ tương thích
 */
export function transformBookingResponse(response: BookingListResponse): BookingListResponse & {
  page: number
  pageSize: number
  total: number
} {
  const { meta } = response
  const page = Math.floor(meta.skip / meta.pageSize) + 1

  return {
    ...response,
    page,
    pageSize: meta.pageSize,
    total: meta.total,
  } as BookingListResponse & {
    page: number
    pageSize: number
    total: number
  }
}

/**
 * Transform page-based params sang skip-based cho API
 */
export function transformPageToSkip(page: number, pageSize: number): { skip: number; pageSize: number } {
  return {
    skip: (page - 1) * pageSize,
    pageSize,
  }
}

/**
 * Transform skip-based params sang page-based
 */
export function transformSkipToPage(skip: number, pageSize: number): { page: number; pageSize: number } {
  return {
    page: Math.floor(skip / pageSize) + 1,
    pageSize,
  }
}
