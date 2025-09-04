import { z } from 'zod'

import { ReferrerList } from '@/components/referrer/referrer-list'
import mockReferrers from '@/mocks/mockReferrerData'
import { createFileRoute } from '@tanstack/react-router'

const referrerSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  status: z.array(z.string()).optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/referrers/')({
  validateSearch: referrerSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  // Mock data handling - similar to bookings route
  const referrerData = { data: mockReferrers, total: mockReferrers.length, page: 1, pageSize: 10 }
  const isLoading = false
  const error: any = null
  const refetch = () => {}
  const searchValue = ''
  const handleSearch = (_v?: string) => {}

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
        <ReferrerList
          data={referrerData?.data || []}
          isLoading={isLoading}
          currentPage={referrerData?.page || 1}
          pageSize={referrerData?.pageSize || 10}
          totalCount={referrerData?.total || 0}
          searchValue={searchValue}
          onSearchChange={handleSearch}
        />
      )}
    </div>
  )
}
