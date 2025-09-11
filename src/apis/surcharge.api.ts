import { parseAndLog } from '@/schemas/log'
import type {
  SurchargeDetailResponse,
  SurchargeListResponse,
  UpdateSurchargeRequest,
  UpdateSurchargeResponse,
} from '@/schemas/surcharge.schemas'
import {
  SurchargeDetailResponseSchema,
  SurchargeListResponseSchema,
  UpdateSurchargeResponseSchema,
} from '@/schemas/surcharge.schemas'
import http from '@/utils/http'

export const surchargeAPI = {
  getSurcharges: async (
    page: number,
    pageSize: number,
    keyword: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<SurchargeListResponse> => {
    const response = await http.booking_http.get<SurchargeListResponse>(
      `/surcharge?page=${page}&pageSize=${pageSize}&keyword=${keyword}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`,
    )
    return parseAndLog(SurchargeListResponseSchema, response.data, 'get surcharges')
  },
  getSurchargeDetail: async (id: number): Promise<SurchargeDetailResponse> => {
    const response = await http.booking_http.get<SurchargeDetailResponse>(`/surcharge/${id}`)
    return parseAndLog(SurchargeDetailResponseSchema, response.data, 'get surcharge detail')
  },
  updateSurcharge: async (id: number, data: UpdateSurchargeRequest): Promise<UpdateSurchargeResponse> => {
    const response = await http.booking_http.put<UpdateSurchargeResponse>(`/surcharge/${id}`, data)
    return parseAndLog(UpdateSurchargeResponseSchema, response.data, 'update surcharge')
  },
}
