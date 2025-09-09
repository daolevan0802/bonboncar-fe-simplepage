import { useState } from 'react'
import { z } from 'zod'

import { BookingMap } from '@/components/booking/booking-map'
import { SimplifiedBookingTable } from '@/components/booking/simplified-booking-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAffiliateBookingsQueries } from '@/queries/affiliate.queries'
import type { Booking } from '@/schemas/affiliate.schemas'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

const bookingsSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
})

export const Route = createFileRoute('/dashboard/bookings/')({
  validateSearch: bookingsSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  // State để quản lý booking được chọn
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const navigate = useNavigate()

  // Get search params
  const { page, pageSize, keyword, sortBy, sortOrder } = Route.useSearch()

  // Use affiliate bookings query with isAdmin = true
  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useAffiliateBookingsQueries(
    {
      page,
      pageSize,
      keyword: keyword || '',
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
    {
      // Enable the query
      enabled: true,
    },
  )

  const handleViewBooking = (_booking: any) => {}
  const handleEditBooking = (_booking: any) => {}
  const searchValue = keyword || ''

  const handleSearch = (value?: string) => {
    navigate({
      to: '/dashboard/bookings',
      search: {
        page: 1, // Reset to first page when searching
        pageSize,
        keyword: value || undefined,
        sortBy,
        sortOrder,
      },
    })
  }

  const handleSort = (newSortBy?: string, newSortOrder?: 'ASC' | 'DESC') => {
    navigate({
      to: '/dashboard/bookings',
      search: {
        page: 1, // Reset to first page when sorting
        pageSize,
        keyword,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      },
    })
  }

  // Handler để xử lý khi người dùng chọn booking
  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking)
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đặt xe</h1>
          <p className="text-muted-foreground">Danh sách và quản lý các đơn đặt xe</p>
        </div>
        <div className="flex gap-2">&nbsp;</div>
      </div>

      {/* Status Tabs */}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đặt xe</CardTitle>
          <CardDescription>
            {bookingsData?.meta?.total ? `Tổng cộng ${bookingsData.meta.total} đơn đặt xe` : 'Đang tải...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-destructive mb-4">
                {error instanceof Error && error.message.includes('ZodError')
                  ? 'Dữ liệu từ server không đúng định dạng mong đợi'
                  : 'Có lỗi xảy ra khi tải dữ liệu'}
              </p>
              {error instanceof Error && error.message.includes('ZodError') && (
                <details className="mb-4 text-left max-w-md">
                  <summary className="cursor-pointer text-sm font-medium">Chi tiết lỗi (dev only)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{error.message}</pre>
                </details>
              )}
              <Button onClick={() => refetch()}>Thử lại</Button>
            </div>
          ) : (
            <SimplifiedBookingTable
              data={(bookingsData?.data as any) || []}
              isLoading={isLoading}
              onViewBooking={handleViewBooking}
              onEditBooking={handleEditBooking}
              currentPage={
                bookingsData?.meta?.skip ? Math.floor(bookingsData.meta.skip / bookingsData.meta.pageSize) + 1 : 1
              }
              pageSize={bookingsData?.meta?.pageSize || 10}
              totalCount={bookingsData?.meta?.total || 0}
              searchValue={searchValue}
              onSearchChange={handleSearch}
              selectedBookingId={selectedBooking?.id || null}
              onBookingSelect={handleBookingSelect}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSort}
            />
          )}
        </CardContent>
      </Card>

      {/* Booking Map - Hiển thị bản đồ khi có booking được chọn */}
      {selectedBooking && (
        <div className="mt-6">
          <BookingMap
            address={
              selectedBooking.delivery_address_to_cust ||
              selectedBooking.delivery_address_from_cust ||
              'Không có địa chỉ'
            }
            className="w-full"
          />
        </div>
      )}

      {/* Create booking feature removed per request */}
    </div>
  )
}
