import type {
  AffiliateDashboardResponse,
  GetAffiliateBookingsResponse,
  GetAffiliateResponse,
} from '@/schemas/affiliate.schemas'
import {
  AffiliateDashboardResponseSchema,
  GetAffiliateBookingsResponseSchema,
  GetAffiliateResponseSchema,
} from '@/schemas/affiliate.schemas'
import { parseAndLog } from '@/schemas/log'
import http from '@/utils/http'

export const affiliateAPI = {
  getAffiliates: async (
    page: number,
    pageSize: number,
    keyword: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<GetAffiliateResponse> => {
    const response = await http.booking_http.get<GetAffiliateResponse>(
      `/affiliates?page=${page}&pageSize=${pageSize}&keyword=${keyword}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`,
    )
    return parseAndLog(GetAffiliateResponseSchema, response.data, 'get affiliates')
  },
  getAffiliateBookings: async (
    page: number,
    pageSize: number,
    keyword: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<GetAffiliateBookingsResponse> => {
    const response = await http.booking_http.get<GetAffiliateBookingsResponse>(
      `/affiliates/bookings?page=${page}&pageSize=${pageSize}&keyword=${keyword} ${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`,
    )
    return parseAndLog(GetAffiliateBookingsResponseSchema, response.data, 'get affiliate bookings')
  },
  getAffiliateDashboardStats: async (year: number): Promise<AffiliateDashboardResponse> => {
    const response = await http.booking_http.get<AffiliateDashboardResponse>(`/affiliates/statistic?year=${year}  `)
    return parseAndLog(AffiliateDashboardResponseSchema, response.data, 'get affiliate dashboard stats')
  },
}
