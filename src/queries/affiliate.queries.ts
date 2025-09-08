import { affiliateAPI } from '@/apis/affiliate.api'
import type {
  AffiliateBookingsFilter,
  AffiliateDashboardResponse,
  AffiliateFilter,
  GetAffiliateBookingsResponse,
  GetAffiliateResponse,
} from '@/schemas/affiliate.schemas'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

// Query Keys
export const affiliateQueryKeys = {
  all: ['affiliates'] as const,
  lists: () => [...affiliateQueryKeys.all, 'list'] as const,
  list: (filter: AffiliateFilter) => [...affiliateQueryKeys.lists(), filter] as const,
  details: () => [...affiliateQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...affiliateQueryKeys.details(), id] as const,
  dashboardStats: (year: number) => [...affiliateQueryKeys.all, 'dashboardStats', year] as const,
}

// Query Keys
export const affiliateBookingsQueryKeys = {
  all: ['affiliates'] as const,
  lists: () => [...affiliateBookingsQueryKeys.all, 'list'] as const,
  list: (filter: AffiliateFilter) => [...affiliateBookingsQueryKeys.lists(), filter] as const,
  details: () => [...affiliateBookingsQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...affiliateQueryKeys.details(), id] as const,
}

// Query to fetch affiliates with pagination and keyword filtering
export function useAffiliatesQueries(
  filter: AffiliateFilter,
  options?: Omit<UseQueryOptions<GetAffiliateResponse, unknown>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: affiliateQueryKeys.list(filter),
    queryFn: () => affiliateAPI.getAffiliates(filter.page, filter.pageSize, filter.keyword || ''),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useAffiliateBookingsQueries(
  filter: AffiliateBookingsFilter,
  options?: Omit<UseQueryOptions<GetAffiliateBookingsResponse, unknown>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: affiliateBookingsQueryKeys.list(filter),
    queryFn: () =>
      affiliateAPI.getAffiliateBookings(filter.page, filter.pageSize, filter.keyword || '', filter.isAffiliate ?? true),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useAffiliateDashboardStatsQueries(
  year: number,
  options?: Omit<UseQueryOptions<AffiliateDashboardResponse, unknown>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: affiliateQueryKeys.dashboardStats(year),
    queryFn: () => affiliateAPI.getAffiliateDashboardStats(year),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
