import { surchargeAPI } from '@/apis/surcharge.api'
import type {
  SurchargeDetailResponse,
  SurchargeFilter,
  SurchargeListResponse,
  UpdateSurchargeRequest,
  UpdateSurchargeResponse,
} from '@/schemas/surcharge.schemas'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSurchargesQueries(
  filter: SurchargeFilter,
  options?: Omit<UseQueryOptions<SurchargeListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['surcharge-list', filter],
    queryFn: () =>
      surchargeAPI.getSurcharges(filter.page, filter.pageSize, filter.keyword || '', filter.sortBy, filter.sortOrder),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useSurchargeDetailQueries(
  id: number,
  options?: Omit<UseQueryOptions<SurchargeDetailResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['surcharge-detail', id],
    queryFn: () => surchargeAPI.getSurchargeDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useUpdateSurchargeMutation(
  options?: UseMutationOptions<UpdateSurchargeResponse, Error, { id: number; data: UpdateSurchargeRequest }>,
) {
  const queryClient = useQueryClient()

  return useMutation<UpdateSurchargeResponse, Error, { id: number; data: UpdateSurchargeRequest }>({
    mutationFn: ({ id, data }) => surchargeAPI.updateSurcharge(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables

      queryClient.invalidateQueries({ queryKey: ['surcharge-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['surcharge-list'] })
      queryClient.invalidateQueries({ queryKey: ['surcharges'] })
      queryClient.setQueryData(['surcharge-detail', id], { data: data.data, meta: {} })

      // Call the component's onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, undefined)
      }
    },
    onError: (error) => {
      console.error('Update surcharge failed:', error)
      if (options?.onError) {
        options.onError(error, undefined as any, undefined)
      }
    },
  })
}
