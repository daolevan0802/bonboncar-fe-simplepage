import { transformBookingResponse } from '@/lib/booking-utils'
import type {
  BookBookingResponse,
  BookingDetailFull,
  BookingFeeInfoResponse,
  BookingFilter,
  BookingListResponse,
  CancelBookingRequest,
  CancelBookingResponse,
  CarSkuList,
  ChangeStatusRequest,
  ChangeStatusResponse,
  ClientSearch,
  CompleteBookingResponse,
  // Create booking types
  CreateBookingRequest,
  CreateBookingResponse,
  DepositResponse,
  FeeDraftUpdateRequest,
  FeeDraftUpdateResponse,
  FeeVerifyRequest,
  FeeVerifyResponse,
  HostCheckoutResponse,
  HostVerifyResponse,
  RenterCheckinResponse,
  RenterCheckoutResponse,
  RenterVerifyResponse,
  SignContractResponse,
  UnverifyFaceResponse,
  UpdatedBookingFee,
  UpdatedBookingFeeResponse,
  UpdateDepositRequest,
  UpdateLicenseInfo,
  UpdateTripInfo,
  UpdateVatInfo,
  VerifyFaceResponse,
} from '@/schemas/booking.schemas'
import {
  BookBookingResponseSchema,
  BookingDetailFullSchema,
  BookingFeeInfoResponseSchema,
  BookingFilterSchema,
  BookingListResponseSchema,
  CancelBookingResponseSchema,
  // Create booking schemas
  CarSkuListSchema,
  ChangeStatusResponseSchema,
  ClientSearchSchema,
  CompleteBookingResponseSchema,
  CreateBookingRequestSchema,
  CreateBookingResponseSchema,
  DepositResponseSchema,
  FeeDraftUpdateResponseSchema,
  FeeVerifyResponseSchema,
  HostCheckoutResponseSchema,
  HostVerifyResponseSchema,
  RenterCheckinResponseSchema,
  RenterCheckoutResponseSchema,
  RenterVerifyResponseSchema,
  SignContractRequestSchema,
  SignContractResponseSchema,
  UnverifyFaceResponseSchema,
  UpdatedBookingFeeResponseSchema,
  UpdateDepositRequestSchema,
  VerifyFaceResponseSchema,
  // Ensure BookingFeeInfoResponseSchema is imported as value
} from '@/schemas/booking.schemas'
import { frontendToBackendStatus } from '@/schemas/enum.schemas'
import { parseAndLog } from '@/schemas/log'
import http from '@/utils/http'

export const bookingAPI = {
  // Get filtered bookings with pagination
  getBookings: async (
    params: BookingFilter,
  ): Promise<BookingListResponse & { page: number; pageSize: number; total: number }> => {
    try {
      // Validate request parameters
      const validatedParams = BookingFilterSchema.parse(params)

      // Transform frontend status keys to backend status values
      const transformedFilters = validatedParams.filters
        ? {
            ...validatedParams.filters,
            status: validatedParams.filters.status?.map(
              (status) => frontendToBackendStatus[status as keyof typeof frontendToBackendStatus],
            ),
          }
        : undefined

      // Make API request
      const response = await http.booking_http.get<BookingListResponse>('/bookings/filter', {
        params: {
          page: validatedParams.page,
          pageSize: validatedParams.pageSize,
          orderBy: JSON.stringify(validatedParams.orderBy),
          filters: transformedFilters ? JSON.stringify(transformedFilters) : undefined,
        },
      })

      // Validate and transform response
      return transformBookingResponse(parseAndLog(BookingListResponseSchema, response.data, 'fetch bookings'))
    } catch (error) {
      console.error(error, 'fetch bookings')
      throw error
    }
  },

  // Get single booking by ID
  getBooking: async (id: number | string): Promise<BookingDetailFull> => {
    try {
      const response = await http.booking_http.get<BookingDetailFull>(`/bookings/${id}`)
      return parseAndLog(BookingDetailFullSchema, response.data, 'fetch booking')
    } catch (error) {
      console.error(error, 'fetch booking')
      throw error
    }
  },

  // Cancel booking
  cancelBooking: async (id: number, data: CancelBookingRequest): Promise<CancelBookingResponse> => {
    try {
      // Lọc bỏ các trường rỗng/null
      const filteredData: CancelBookingRequest = {
        cancel_fee_percentage: data.cancel_fee_percentage,
        is_no_deposit: data.is_no_deposit,
      }
      if (data.host_commission !== '' && data.host_commission != null) {
        filteredData.host_commission = data.host_commission
      }
      if (data.reason_of_cancel !== '' && data.reason_of_cancel != null) {
        filteredData.reason_of_cancel = data.reason_of_cancel
      }

      const response = await http.booking_http.post<CancelBookingResponse>(`/bookings/${id}/cancel`, filteredData)
      return parseAndLog(CancelBookingResponseSchema, response.data, 'cancel booking')
    } catch (error) {
      console.error(error, 'cancel booking')
      throw error
    }
  },

  // Change booking status
  changeBookingStatus: async (id: number, data: ChangeStatusRequest): Promise<ChangeStatusResponse> => {
    try {
      const response = await http.booking_http.post<ChangeStatusResponse>(`/bookings/${id}/status/change`, data)
      return parseAndLog(ChangeStatusResponseSchema, response.data, 'change booking status')
    } catch (error) {
      console.error(error, 'change booking status')
      throw error
    }
  },

  // Book a booking
  bookBooking: async (bookingId: number | string): Promise<BookBookingResponse> => {
    try {
      const response = await http.booking_http.post<BookBookingResponse>(`/bookings/${bookingId}/book`)
      return parseAndLog(BookBookingResponseSchema, response.data, 'book booking')
    } catch (error) {
      console.error(error, 'book booking')
      throw error
    }
  },

  // Confirm sign contract
  confirmSignContract: async (
    bookingId: number | string,
    data: { is_from_cms: boolean },
  ): Promise<SignContractResponse> => {
    try {
      const validated = SignContractRequestSchema.parse(data)
      const response = await http.booking_http.post<SignContractResponse>(
        `/bookings/${bookingId}/sign-contract`,
        validated,
      )
      return parseAndLog(SignContractResponseSchema, response.data, 'confirm sign contract')
    } catch (error) {
      console.error(error, 'confirm sign contract')
      throw error
    }
  },

  // Confirm deposit booking
  confirmDepositBooking: async (bookingId: number | string): Promise<DepositResponse> => {
    try {
      const response = await http.booking_http.post<DepositResponse>(`/bookings/${bookingId}/deposit`)
      return parseAndLog(DepositResponseSchema, response.data, 'confirm deposit booking')
    } catch (error) {
      console.error(error, 'confirm deposit booking')
      throw error
    }
  },

  // Renter check-in
  renterCheckin: async (bookingId: number | string): Promise<RenterCheckinResponse> => {
    try {
      const response = await http.booking_http.post<RenterCheckinResponse>(`/bookings/${bookingId}/cms/check-in`)
      return parseAndLog(RenterCheckinResponseSchema, response.data, 'renter check-in')
    } catch (error) {
      console.error(error, 'renter check-in')
      throw error
    }
  },

  // Confirm renter check-out
  confirmRenterCheckout: async (bookingId: number | string): Promise<RenterCheckoutResponse> => {
    try {
      const response = await http.booking_http.post<RenterCheckoutResponse>(
        `/bookings/${bookingId}/cms/renter-check-out`,
      )
      return parseAndLog(RenterCheckoutResponseSchema, response.data, 'confirm renter check-out')
    } catch (error) {
      console.error(error, 'confirm renter check-out')
      throw error
    }
  },

  // Host check-out
  hostCheckout: async (bookingId: number | string): Promise<HostCheckoutResponse> => {
    try {
      const response = await http.booking_http.post<HostCheckoutResponse>(`/bookings/${bookingId}/host-check-out`)
      return parseAndLog(HostCheckoutResponseSchema, response.data, 'host check-out')
    } catch (error) {
      console.error(error, 'host check-out')
      throw error
    }
  },

  // Complete booking
  completeBooking: async (bookingId: number | string): Promise<CompleteBookingResponse> => {
    try {
      const response = await http.booking_http.post<CompleteBookingResponse>(`/bookings/${bookingId}/complete`)
      return parseAndLog(CompleteBookingResponseSchema, response.data, 'complete booking')
    } catch (error) {
      console.error(error, 'complete booking')
      throw error
    }
  },

  // Verify face
  verifyFace: async (bookingId: number | string): Promise<VerifyFaceResponse> => {
    try {
      const response = await http.booking_http.post<VerifyFaceResponse>(`/bookings/${bookingId}/face/bypass`)
      return parseAndLog(VerifyFaceResponseSchema, response.data, 'verify face')
    } catch (error) {
      console.error(error, 'verify face')
      throw error
    }
  },

  // Unverify face
  unverifyFace: async (bookingId: number | string): Promise<UnverifyFaceResponse> => {
    try {
      const response = await http.booking_http.post<UnverifyFaceResponse>(`/bookings/${bookingId}/face/revoke`)
      return parseAndLog(UnverifyFaceResponseSchema, response.data, 'unverify face')
    } catch (error) {
      console.error(error, 'unverify face')
      throw error
    }
  },

  // Update VAT info
  updateVatInfo: async (bookingId: number | string, data: UpdateVatInfo): Promise<UpdatedBookingFeeResponse> => {
    try {
      const response = await http.booking_http.post<UpdatedBookingFeeResponse>(
        `/bookings/${bookingId}/update-vat-info`,
        data,
      )
      return parseAndLog(UpdatedBookingFeeResponseSchema, response.data, 'update vat info')
    } catch (error) {
      console.error(error, 'update vat info')
      throw error
    }
  },

  // Update trip info
  updateTripInfo: async (bookingId: number | string, data: UpdateTripInfo): Promise<UpdatedBookingFeeResponse> => {
    try {
      const response = await http.booking_http.post<UpdatedBookingFeeResponse>(
        `/bookings/${bookingId}/update-purpose-info`,
        data,
      )
      return parseAndLog(UpdatedBookingFeeResponseSchema, response.data, 'update trip info')
    } catch (error) {
      console.error(error, 'update trip info')
      throw error
    }
  },

  // Update license info
  updateLicenseInfo: async (
    bookingId: number | string,
    data: UpdateLicenseInfo,
  ): Promise<UpdatedBookingFeeResponse> => {
    try {
      const response = await http.booking_http.post<UpdatedBookingFeeResponse>(
        `/bookings/${bookingId}/update-license-info`,
        data,
      )
      return parseAndLog(UpdatedBookingFeeResponseSchema, response.data, 'update license info')
    } catch (error) {
      console.error(error, 'update license info')
      throw error
    }
  },

  // Unverify license info
  unverifyLicenseInfo: async (bookingId: number | string): Promise<UpdatedBookingFeeResponse> => {
    try {
      const response = await http.booking_http.post<UpdatedBookingFeeResponse>(
        `/bookings/${bookingId}/unverify-license-info`,
      )
      return parseAndLog(UpdatedBookingFeeResponseSchema, response.data, 'unverify license info')
    } catch (error) {
      console.error(error, 'unverify license info')
      throw error
    }
  },

  // Cập nhật lại giá thuê booking
  updateBookingFee: async (bookingId: number | string, data: UpdatedBookingFee): Promise<UpdatedBookingFeeResponse> => {
    const response = await http.booking_http.post<UpdatedBookingFeeResponse>(`/bookings/${bookingId}/update-fees`, data)
    return UpdatedBookingFeeResponseSchema.parse(response.data)
  },

  updateDeposit: async (bookingId: number | string, data: UpdateDepositRequest): Promise<BookingFeeInfoResponse> => {
    try {
      const validated = UpdateDepositRequestSchema.parse(data)
      const response = await http.booking_http.post<BookingFeeInfoResponse>(
        `/bookings/${bookingId}/deposit/update`,
        validated,
      )
      return parseAndLog(BookingFeeInfoResponseSchema, response.data, 'update deposit')
    } catch (error) {
      console.error(error, 'update deposit')
      throw error
    }
  },
}

export const getCarSkuList = async (): Promise<CarSkuList> => {
  try {
    const response = await http.booking_http.get<CarSkuList>('/cars/sku/list')
    return parseAndLog(CarSkuListSchema, response.data, 'fetch car SKU list')
  } catch (error) {
    // Log và trả về mảng rỗng nếu lỗi
    return { data: [] }
  }
}

export const searchClientsByPhone = async (search: string): Promise<ClientSearch> => {
  try {
    const response = await http.booking_http.get<ClientSearch>(
      `/clients/phone_name_list?search=${encodeURIComponent(search)}`,
    )
    return parseAndLog(ClientSearchSchema, response.data, 'search clients by phone')
  } catch (error) {
    console.error(error, 'search clients by phone')
    throw error
  }
}

export const getApplicablePromotions = async (
  carSku: string,
  scheduledPickupTimestamp: string,
  scheduledReturnTimestamp: string,
): Promise<{ success: boolean; data: Array<string> }> => {
  try {
    const params = new URLSearchParams({
      car_sku: carSku,
      scheduled_pickup_timestamp: scheduledPickupTimestamp,
      scheduled_return_timestamp: scheduledReturnTimestamp,
    })

    const response = await http.booking_http.get<{ success: boolean; data: Array<string> }>(
      `/promotions/applicable/list?${params.toString()}`,
    )
    return response.data
  } catch (error) {
    console.error(error, 'get applicable promotions')
    // Return empty array on error
    return { success: false, data: [] }
  }
}

export const createBooking = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
  try {
    const validated = CreateBookingRequestSchema.parse(data)
    const response = await http.booking_http.post<CreateBookingResponse>('/bookings/cms', validated)
    return parseAndLog(CreateBookingResponseSchema, response.data, 'create booking')
  } catch (error) {
    console.error(error, 'create booking')
    throw error
  }
}

export async function feeVerifyBooking(bookingId: string | number, body: FeeVerifyRequest): Promise<FeeVerifyResponse> {
  try {
    const response = await http.booking_http.post<FeeVerifyResponse>(`/bookings/${bookingId}/fee-verify`, body)
    return parseAndLog(FeeVerifyResponseSchema, response.data, 'fee verify booking')
  } catch (error) {
    console.error(error, 'fee verify booking')
    throw error
  }
}

export async function updateBookingFeeDraft(
  bookingId: string | number,
  body: FeeDraftUpdateRequest,
): Promise<FeeDraftUpdateResponse> {
  try {
    const response = await http.booking_http.post<FeeDraftUpdateResponse>(`/bookings/${bookingId}/detail/update`, body)
    return parseAndLog(FeeDraftUpdateResponseSchema, response.data, 'update booking fee draft')
  } catch (error) {
    console.error(error, 'update booking fee draft')
    throw error
  }
}

export async function getBookingFeeInfo(params: Record<string, string>): Promise<BookingFeeInfoResponse> {
  try {
    const search = new URLSearchParams(params)
    const response = await http.booking_http.get<BookingFeeInfoResponse>(
      `/bookings/booking-info/cms?${search.toString()}`,
    )
    return parseAndLog(BookingFeeInfoResponseSchema, response.data, 'get booking fee info')
  } catch (error) {
    console.error(error, 'get booking fee info')
    throw error
  }
}

export async function hostVerifyBooking(bookingId: string | number): Promise<HostVerifyResponse> {
  try {
    const response = await http.booking_http.post<HostVerifyResponse>(`/bookings/${bookingId}/host-verify`)
    return parseAndLog(HostVerifyResponseSchema, response.data, 'verify host')
  } catch (error) {
    console.error(error, 'host verify booking')
    throw error
  }
}

export async function renterVerifyBooking(bookingId: string | number): Promise<RenterVerifyResponse> {
  try {
    const response = await http.booking_http.post<RenterVerifyResponse>(`/bookings/${bookingId}/cms/renter-verify`)
    return parseAndLog(RenterVerifyResponseSchema, response.data, 'verify renter')
  } catch (error) {
    console.error(error, 'renter verify booking')
    throw error
  }
}
