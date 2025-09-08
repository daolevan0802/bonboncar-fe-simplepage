import { z } from 'zod'

import { AffiliateList } from '@/components/affiliate/affiliate-list'
import { useAffiliatesQueries } from '@/queries/affiliate.queries'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

const affiliateSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  keyword: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/affiliates/')({
  validateSearch: affiliateSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { page, pageSize, keyword } = Route.useSearch()
  const navigate = useNavigate()

  // Use real API data
  const {
    data: affiliateData,
    isLoading,
    error,
    refetch,
  } = useAffiliatesQueries({
    page,
    pageSize,
    keyword: keyword || undefined,
  })

  const searchValue = keyword || ''
  const handleSearch = (value?: string) => {
    // Navigate with new search params
    navigate({
      to: '/dashboard/affiliates',
      search: {
        page: 1, // Reset to first page when searching
        pageSize,
        keyword: value || undefined,
      },
    })
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đại lý</h1>
          <p className="text-muted-foreground">Danh sách và quản lý các đại lý giới thiệu</p>
        </div>
        <div className="flex gap-2">&nbsp;</div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-destructive mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
          <button onClick={() => refetch()}>Thử lại</button>
        </div>
      ) : (
        <AffiliateList
          data={affiliateData?.data || []}
          isLoading={isLoading}
          currentPage={page}
          pageSize={pageSize}
          totalCount={affiliateData?.meta?.total || 0}
          searchValue={searchValue}
          onSearchChange={handleSearch}
        />
      )}
    </div>
  )
}
