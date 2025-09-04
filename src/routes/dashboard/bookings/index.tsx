import { z } from 'zod'

import { SimplifiedBookingTable } from '@/components/booking/simplified-booking-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import mockBookings from '@/mocks/mockBookingData'
import { createFileRoute } from '@tanstack/react-router'

const bookingsSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  status: z.array(z.string()).optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/bookings/')({
  validateSearch: bookingsSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  // useBookingsPage hook not available; use a minimal local stub so the page still renders
  const bookingsData = { data: mockBookings, total: mockBookings.length, page: 1, pageSize: 10 }
  const isLoading = false
  const error: any = null
  const refetch = () => {}
  const handleViewBooking = (_booking: any) => {}
  const handleEditBooking = (_booking: any) => {}
  const handleDeleteBooking = (_booking: any) => {}
  const searchValue = ''
  const handleSearch = (_v?: string) => {}

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
            {bookingsData?.total ? `Tổng cộng ${bookingsData.total} đơn đặt xe` : 'Đang tải...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-destructive mb-4">
                {error.message.includes('ZodError')
                  ? 'Dữ liệu từ server không đúng định dạng mong đợi'
                  : 'Có lỗi xảy ra khi tải dữ liệu'}
              </p>
              {error.message.includes('ZodError') && (
                <details className="mb-4 text-left max-w-md">
                  <summary className="cursor-pointer text-sm font-medium">Chi tiết lỗi (dev only)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{error.message}</pre>
                </details>
              )}
              <Button onClick={() => refetch()}>Thử lại</Button>
            </div>
          ) : (
            <SimplifiedBookingTable
              data={bookingsData?.data || []}
              isLoading={isLoading}
              onViewBooking={handleViewBooking}
              onEditBooking={handleEditBooking}
              onDeleteBooking={handleDeleteBooking}
              currentPage={bookingsData?.page || 1}
              pageSize={bookingsData?.pageSize || 10}
              totalCount={bookingsData?.total || 0}
              searchValue={searchValue}
              onSearchChange={handleSearch}
            />
          )}
        </CardContent>
      </Card>

      {/* Create booking feature removed per request */}
    </div>
  )
}
