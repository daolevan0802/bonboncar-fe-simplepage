import {
  bookingAPI,
  createBooking,
  feeVerifyBooking,
  getApplicablePromotions,
  getBookingFeeInfo,
  getCarSkuList,
  hostVerifyBooking,
  renterVerifyBooking,
  searchClientsByPhone,
  updateBookingFeeDraft,
} from '@/apis/booking.api'
import type {
  BookingDetailFull,
  BookingFilter,
  BookingListResponse,
  CancelBookingRequest,
  ChangeStatusRequest,
  CreateBookingRequest,
  FeeDraftUpdateRequest,
  FeeVerifyRequest,
  UpdatedBookingFee,
  UpdateDepositRequest,
  UpdateLicenseInfo,
  UpdateTripInfo,
  UpdateVatInfo,
} from '@/schemas/booking.schemas'
import { getAutocompleteSuggestions } from '@/utils/goong'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Extended response type với backward compatibility
type ExtendedBookingListResponse = BookingListResponse & {
  page: number
  pageSize: number
  total: number
}

// Query Keys
export const bookingQueryKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingQueryKeys.all, 'list'] as const,
  list: (filter: BookingFilter) => [...bookingQueryKeys.lists(), filter] as const,
  details: () => [...bookingQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookingQueryKeys.details(), id] as const,
}

// --- Queries ---

/**
 * Hook to fetch bookings list with filters
 */
export function useBookingsQueries(
  filter: BookingFilter,
  options?: Omit<UseQueryOptions<ExtendedBookingListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: bookingQueryKeys.list(filter),
    queryFn: () => bookingAPI.getBookings(filter),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch a single booking by ID
 */
export function useBookingQueries(
  id: number,
  options?: Omit<UseQueryOptions<BookingDetailFull>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: bookingQueryKeys.detail(id),
    queryFn: () => bookingAPI.getBooking(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

// --- Mutations ---

/**
 * Hook to cancel a booking
 */
export function useCancelBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cancel-booking'],
    mutationFn: ({ id, data }: { id: number; data: CancelBookingRequest }) => bookingAPI.cancelBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-booking-status'],
    mutationFn: ({ id, data }: { id: number; data: ChangeStatusRequest }) => bookingAPI.changeBookingStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to book a booking
 */
export function useBookBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['book-booking'],
    mutationFn: (bookingId: number | string) => bookingAPI.bookBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to confirm sign contract
 */
export function useConfirmSignContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['confirm-sign-contract'],
    mutationFn: ({ bookingId, is_from_cms }: { bookingId: number | string; is_from_cms: boolean }) =>
      bookingAPI.confirmSignContract(bookingId, { is_from_cms }),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to confirm deposit booking
 */
export function useConfirmDepositBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['confirm-deposit-booking'],
    mutationFn: (bookingId: number | string) => bookingAPI.confirmDepositBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to renter check-in
 */
export function useRenterCheckinMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['renter-checkin'],
    mutationFn: (bookingId: number | string) => bookingAPI.renterCheckin(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to confirm renter check-out
 */
export function useConfirmRenterCheckoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['confirm-renter-checkout'],
    mutationFn: (bookingId: number | string) => bookingAPI.confirmRenterCheckout(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to host check-out
 */
export function useHostCheckoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['host-checkout'],
    mutationFn: (bookingId: number | string) => bookingAPI.hostCheckout(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to complete booking
 */
export function useCompleteBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['complete-booking'],
    mutationFn: (bookingId: number | string) => bookingAPI.completeBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

/**
 * Hook to verify face
 */
export function useVerifyFaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['verify-face'],
    mutationFn: (bookingId: number | string) => bookingAPI.verifyFace(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useUnverifyFaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['unverify-face'],
    mutationFn: (bookingId: number | string) => bookingAPI.unverifyFace(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export const createBookingQueryKeys = {
  all: ['create-booking'] as const,
  carSkuList: () => [...createBookingQueryKeys.all, 'car-sku-list'] as const,
  clientSearch: (search: string) => [...createBookingQueryKeys.all, 'client-search', search] as const,
}

export function useGetCarSkuList() {
  return useQuery({
    queryKey: createBookingQueryKeys.carSkuList(),
    queryFn: getCarSkuList,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useSearchClientsByPhone({ search, enabled }: { search: string; enabled: boolean }) {
  return useQuery({
    queryKey: createBookingQueryKeys.clientSearch(search),
    queryFn: () => searchClientsByPhone(search),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-booking'],
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
    onError: (error: any) => {
      console.error('❌ Create booking error:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        config: error?.config,
      })
    },
    onSettled: (data, error) => {
      console.log('🏁 Create booking mutation settled:', {
        hasData: !!data,
        hasError: !!error,
        errorStatus: error?.response?.status,
      })
    },
  })
}

export function useCarSkuList() {
  return useQuery({
    queryKey: ['carSkuList'],
    queryFn: getCarSkuList,
  })
}

export function useAddressSearch({ query, enabled }: { query: string; enabled: boolean }) {
  return useQuery({
    queryKey: [...createBookingQueryKeys.all, 'address-search', query],
    queryFn: () => getAutocompleteSuggestions(query),
    enabled: enabled && query.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useApplicablePromotions({
  carSku,
  scheduledPickupTimestamp,
  scheduledReturnTimestamp,
  enabled,
}: {
  carSku: string
  scheduledPickupTimestamp: string
  scheduledReturnTimestamp: string
  enabled: boolean
}) {
  return useQuery({
    queryKey: [
      ...createBookingQueryKeys.all,
      'applicable-promotions',
      carSku,
      scheduledPickupTimestamp,
      scheduledReturnTimestamp,
    ],
    queryFn: () => getApplicablePromotions(carSku, scheduledPickupTimestamp, scheduledReturnTimestamp),
    enabled: enabled && !!carSku && !!scheduledPickupTimestamp && !!scheduledReturnTimestamp,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRecalculateAndUpdateBooking(bookingId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['recalculate-and-update-booking'],
    mutationFn: (data: UpdatedBookingFee) => bookingAPI.updateBookingFee(bookingId, data),
    onSuccess: () => {
      // Invalidate and refetch booking details
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(bookingId)) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useUpdateVatInfo(bookingId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateVatInfo) => bookingAPI.updateVatInfo(bookingId, data),
    onSuccess: () => {
      // Invalidate and refetch booking details
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(bookingId)) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useUpdateTripInfo(bookingId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-trip-info'],
    mutationFn: (data: UpdateTripInfo) => bookingAPI.updateTripInfo(bookingId, data),
    onSuccess: () => {
      // Invalidate and refetch booking details
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(bookingId)) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useUpdateLicenseInfo(bookingId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-license-info'],
    mutationFn: (data: UpdateLicenseInfo) => bookingAPI.updateLicenseInfo(bookingId, data),
    onSuccess: () => {
      // Invalidate and refetch booking details
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(bookingId)) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useUnverifyLicenseInfo(bookingId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['unverify-license-info'],
    mutationFn: () => bookingAPI.unverifyLicenseInfo(bookingId),
    onSuccess: () => {
      // Invalidate and refetch booking details
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(bookingId)) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useBookingFeeVerifyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['booking-fee-verify'],
    mutationFn: ({ bookingId, ...body }: { bookingId: string | number } & FeeVerifyRequest) =>
      feeVerifyBooking(bookingId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(variables.bookingId)) })
    },
  })
}

export function useBookingFeeDraftUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-booking-fee-draft'],
    mutationFn: ({ bookingId, ...body }: { bookingId: string | number } & FeeDraftUpdateRequest) =>
      updateBookingFeeDraft(bookingId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(Number(variables.bookingId)) })
    },
  })
}

export function useBookingFeeInfoQuery({ params, enabled }: { params: Record<string, string>; enabled: boolean }) {
  return useQuery({
    queryKey: ['booking-fee-info', params],
    queryFn: () => getBookingFeeInfo(params),
    enabled: enabled,
  })
}

export function useUpdateDepositMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-deposit'],
    mutationFn: ({ bookingId, data }: { bookingId: number | string; data: UpdateDepositRequest }) =>
      bookingAPI.updateDeposit(bookingId, data),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
    },
  })
}

export function useHostVerifyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['host-verify'],
    mutationFn: (bookingId: number | string) => hostVerifyBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
    },
  })
}

export function useRenterVerifyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['renter-verify'],
    mutationFn: (bookingId: number | string) => renterVerifyBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(bookingId as number) })
    },
  })
}
