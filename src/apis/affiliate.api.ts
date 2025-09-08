import type { GetAffiliateBookingsResponse, GetAffiliateResponse } from '@/schemas/affiliate.schemas'
import { GetAffiliateBookingsResponseSchema, GetAffiliateResponseSchema } from '@/schemas/affiliate.schemas'
import { parseAndLog } from '@/schemas/log'
import http from '@/utils/http'

export const affiliateAPI = {
  getAffiliates: async (page: number, pageSize: number, keyword: string): Promise<GetAffiliateResponse> => {
    const response = await http.booking_http.get<GetAffiliateResponse>(
      `/affiliates?page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
    )
    return parseAndLog(GetAffiliateResponseSchema, response.data, 'get affiliates')
  },
  getAffiliateBookings: async (
    page: number,
    pageSize: number,
    keyword: string,
    isAffiliate: boolean,
  ): Promise<GetAffiliateBookingsResponse> => {
    const response = await http.booking_http.get<GetAffiliateBookingsResponse>(
      `/affiliates/bookings?page=${page}&pageSize=${pageSize}&keyword=${keyword}&isAffiliate=${isAffiliate}`,
    )
    return parseAndLog(GetAffiliateBookingsResponseSchema, response.data, 'get affiliate bookings')
  },
}
