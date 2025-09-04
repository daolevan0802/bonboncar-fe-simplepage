import { useEffect, useMemo, useState } from 'react'
import { Eye, MoreHorizontal } from 'lucide-react'

import { DataTable } from '@/components/table/data-table'
import { DataTableAdvancedToolbar } from '@/components/table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DataTableDateFilter } from '@/components/table/data-table-date-filter'
import { DataTableSkeleton } from '@/components/table/data-table-skeleton'
import { DataTableStatus } from '@/components/table/data-table-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy } from '@/components/ui/copy'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { PaginationWithLinks } from '@/components/ui/pagination-with-links'
import {
  getBookingTypeColor,
  getClientBookingCountColor,
  getClientBookingCountDisplay,
  getClientVerificationColor,
  getClientVerificationDisplay,
  getNoLicensePointColor,
  getNoLicensePointDisplay,
  getPlatformColor,
  getStatusColor,
  getStatusDisplay,
  getVatExportColor,
  getVatExportDisplay,
} from '@/configs/badge-configs'
import { formatDateTime, formatToLowerCase, getSafeValue } from '@/lib/formatters'
import type { Booking } from '@/schemas/booking.schemas'
import type { BookingStatus } from '@/schemas/enum.schemas'
import { COLUMN_LABELS } from '@/schemas/label.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

interface BookingTableProps {
  data: Array<Booking>
  isLoading?: boolean
  onViewBooking?: (booking: Booking) => void
  onEditBooking?: (booking: Booking) => void
  onDeleteBooking?: (booking: Booking) => void
  className?: string
  // Pagination props for display only (PaginationWithLinks handles navigation)
  currentPage?: number
  pageSize?: number
  totalCount?: number
  // New props for search
  searchValue?: string
  onSearchChange?: (value: string) => void
}

// Helper kiểm tra có thể huỷ booking không
// (cancel logic removed per request)

export function BookingTable({
  data,
  isLoading = false,
  onViewBooking,
  onEditBooking,
  className,
  // Pagination props for display only (PaginationWithLinks handles navigation)
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  // New search props
  searchValue = '',
  onSearchChange,
}: BookingTableProps) {
  // Chỉ dùng inputValue cho UI, không liên quan đến table state
  const [inputValue, setInputValue] = useState(searchValue)

  // (Removed cancel/create actions per request)

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  const columns = useMemo<Array<ColumnDef<Booking>>>(
    () => [
      {
        accessorKey: 'booking_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.booking_id} />,
        cell: ({ row }) => (
          <div>
            <Copy value={getSafeValue(row.getValue('booking_id'))} className="font-medium text-blue-600" />
          </div>
        ),
        enableHiding: false,
        size: 140,
        pinned: 'left',
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.status} />,
        cell: ({ row }) => {
          const status = String(row.getValue('status')) as BookingStatus
          return (
            <Badge variant="outline" className={getStatusColor(status)}>
              {getStatusDisplay(status)}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
        enableHiding: false,
        size: 140,
        pinned: 'left',
      },
      // 5. Mã xe
      {
        accessorKey: 'car_sku',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.car_sku} />,
        cell: ({ row }) => <Copy value={getSafeValue(row.getValue('car_sku'))} className="font-mono text-sm" />,
      },
      // 3. Tên khách hàng
      {
        accessorKey: 'user_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.user_name} />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('user_name'))}</div>,
      },
      // 3.5. Khách hàng đặt lần đầu
      {
        accessorKey: 'count_client_booking',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.count_client_booking} />,
        cell: ({ row }) => {
          const count = Number(row.getValue('count_client_booking')) || 0
          return (
            <Badge variant="outline" className={getClientBookingCountColor(count)}>
              {getClientBookingCountDisplay(count)}
            </Badge>
          )
        },
      },
      // 4. SĐT
      {
        accessorKey: 'phone_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.phone_number} />,
        cell: ({ row }) => <Copy value={getSafeValue(row.getValue('phone_number'))} className="font-mono text-sm" />,
      },
      // 6. Ngày giờ lấy xe
      {
        accessorKey: 'scheduled_pickup_timestamp',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={COLUMN_LABELS.scheduled_pickup_timestamp} />
        ),
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('scheduled_pickup_timestamp'))}</div>,
        filterFn: (row, id, value) => {
          if (!value || !Array.isArray(value) || value.length === 0) return true

          const rowDate = new Date(row.getValue(id))
          const [startTimestamp, endTimestamp] = value

          if (!startTimestamp && !endTimestamp) return true

          const startDate = startTimestamp ? new Date(startTimestamp) : null
          const endDate = endTimestamp ? new Date(endTimestamp) : null

          if (!startDate && !endDate) return true
          if (startDate && !endDate) return rowDate >= startDate
          if (!startDate && endDate) return rowDate <= endDate

          return startDate && endDate ? rowDate >= startDate && rowDate <= endDate : true
        },
      },
      // 7. Ngày giờ trả xe
      {
        accessorKey: 'scheduled_return_timestamp',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={COLUMN_LABELS.scheduled_return_timestamp} />
        ),
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('scheduled_return_timestamp'))}</div>,
        filterFn: (row, id, value) => {
          if (!value || !Array.isArray(value) || value.length === 0) return true

          const rowDate = new Date(row.getValue(id))
          const [startTimestamp, endTimestamp] = value

          if (!startTimestamp && !endTimestamp) return true

          const startDate = startTimestamp ? new Date(startTimestamp) : null
          const endDate = endTimestamp ? new Date(endTimestamp) : null

          if (!startDate && !endDate) return true
          if (startDate && !endDate) return rowDate >= startDate
          if (!startDate && endDate) return rowDate <= endDate

          return startDate && endDate ? rowDate >= startDate && rowDate <= endDate : true
        },
      },
      // 8. ekyc khách hàng
      {
        accessorKey: 'client',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.client} />,
        cell: ({ row }) => {
          const client = row.getValue('client')
          return (
            <div className="text-sm">
              <Badge variant="outline" className={getClientVerificationColor(!!client)}>
                {getClientVerificationDisplay(!!client)}
              </Badge>
            </div>
          )
        },
      },
      // 9. Ngày giờ đặt
      {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.created_at} />,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">{formatDateTime(row.getValue('created_at'))}</div>
        ),
        filterFn: (row, id, value) => {
          if (!value || !Array.isArray(value) || value.length === 0) return true

          const rowDate = new Date(row.getValue(id))
          const [startTimestamp, endTimestamp] = value

          if (!startTimestamp && !endTimestamp) return true

          const startDate = startTimestamp ? new Date(startTimestamp) : null
          const endDate = endTimestamp ? new Date(endTimestamp) : null

          if (!startDate && !endDate) return true
          if (startDate && !endDate) return rowDate >= startDate
          if (!startDate && endDate) return rowDate <= endDate

          return startDate && endDate ? rowDate >= startDate && rowDate <= endDate : true
        },
      },
      // 10. Lý do huỷ
      {
        accessorKey: 'reason_of_cancel',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.reason_of_cancel} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('reason_of_cancel'))}</div>,
      },
      // 11. Loại đơn đặt xe
      {
        accessorKey: 'booking_type',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.booking_type} />,
        cell: ({ row }) => {
          const type = getSafeValue(row.getValue('booking_type'))
          const vietnameseType = type === 'STANDARD' ? 'Tiêu chuẩn' : type === 'PREMIUM' ? 'Cao cấp' : type
          return (
            <Badge variant="outline" className={getBookingTypeColor()}>
              {vietnameseType}
            </Badge>
          )
        },
      },
      // 12. Phương thức giao xe
      {
        accessorKey: 'delivery_option',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.delivery_option} />,
        cell: ({ row }) => {
          const option = getSafeValue(row.getValue('delivery_option'))
          const vietnameseOption =
            option === 'SELF_PICKUP' ? 'Tự đến lấy' : option === 'DELIVERY' ? 'Giao hàng' : option
          return <div className="text-sm">{vietnameseOption}</div>
        },
      },
      // 13. Địa chỉ giao xe
      {
        accessorKey: 'delivery_address_to_cust',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={COLUMN_LABELS.delivery_address_to_cust} />
        ),
        cell: ({ row }) => (
          <div className="text-sm max-w-xs truncate">{getSafeValue(row.getValue('delivery_address_to_cust'))}</div>
        ),
      },
      // 14. Địa chỉ nhận xe chiều về
      {
        accessorKey: 'delivery_address_from_cust',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={COLUMN_LABELS.delivery_address_from_cust} />
        ),
        cell: ({ row }) => (
          <div className="text-sm max-w-xs truncate">{getSafeValue(row.getValue('delivery_address_from_cust'))}</div>
        ),
      },
      // 15. Nền tảng
      {
        accessorKey: 'platform',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.platform} />,
        cell: ({ row }) => (
          <Badge variant="outline" className={getPlatformColor()}>
            {formatToLowerCase(row.getValue('platform'))}
          </Badge>
        ),
      },
      // 16. Mã khuyến mãi
      {
        accessorKey: 'promotion_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.promotion_code} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('promotion_code'))}</div>,
      },
      // 17. Tag
      {
        accessorKey: 'tag',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.tag} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('tag'))}</div>,
      },
      // 18. Thành phố
      {
        accessorKey: 'user_city',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.user_city} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('user_city'))}</div>,
      },
      // 19. Xuất hoá đơn VAT
      {
        accessorKey: 'is_export_vat',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.is_export_vat} />,
        cell: ({ row }) => {
          const isExportVat = row.getValue('is_export_vat')
          return (
            <Badge variant="outline" className={getVatExportColor(!!isExportVat)}>
              {getVatExportDisplay(!!isExportVat)}
            </Badge>
          )
        },
      },
      // 20. Tên công ty
      {
        accessorKey: 'company_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.company_name} />,
        cell: ({ row }) => (
          <div className="text-sm max-w-xs truncate">{getSafeValue(row.getValue('company_name'))}</div>
        ),
      },
      // 21. Địa chỉ công ty
      {
        accessorKey: 'company_address',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.company_address} />,
        cell: ({ row }) => (
          <div className="text-sm max-w-xs truncate">{getSafeValue(row.getValue('company_address'))}</div>
        ),
      },
      // 22. Mã số thuế
      {
        accessorKey: 'company_tax_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.company_tax_code} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('company_tax_code'))}</div>,
      },
      // 23. Email công ty
      {
        accessorKey: 'company_email',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.company_email} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('company_email'))}</div>,
      },
      // 24. Điều kiện (filters)
      {
        accessorKey: 'filters',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Điều kiện" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('filters'))}</div>,
      },
      // 25. Mục đích
      {
        accessorKey: 'purpose',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.purpose} />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('purpose'))}</div>,
      },
      // 26. Lộ trình
      {
        accessorKey: 'itinerary',
        header: ({ column }) => <DataTableColumnHeader column={column} title={COLUMN_LABELS.itinerary} />,
        cell: ({ row }) => <div className="text-sm max-w-xs truncate">{getSafeValue(row.getValue('itinerary'))}</div>,
      },
      // 27. Mã khách hàng
      {
        accessorKey: 'client_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã khách hàng" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('client_id'))}</div>,
      },
      // 28. Thời gian checkin
      {
        accessorKey: 'renter_checkin_time',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian checkin" />,
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('renter_checkin_time'))}</div>,
      },
      // 29. Thời gian checkout
      {
        accessorKey: 'renter_checkout_time',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian checkout" />,
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('renter_checkout_time'))}</div>,
      },
      // 30. Điểm đăng ký
      {
        accessorKey: 'license_point',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Điểm đăng ký" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('license_point'))}</div>,
      },
      // 31. Không có điểm đăng ký
      {
        accessorKey: 'is_no_license_point',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Không có điểm đăng ký" />,
        cell: ({ row }) => {
          const isNoLicensePoint = row.getValue('is_no_license_point')
          return (
            <Badge variant="outline" className={getNoLicensePointColor(!!isNoLicensePoint)}>
              {getNoLicensePointDisplay(!!isNoLicensePoint)}
            </Badge>
          )
        },
      },
      // 32. Booking version (ID as version)
      {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Booking version" />,
        cell: ({ row }) => <div className="text-sm font-mono">{getSafeValue(row.getValue('id'))}</div>,
      },
      // Actions column
      {
        id: 'actions',
        header: '',
        cell: ({ row: _row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                {/* Per request: no create/cancel actions. View details kept as a non-action item */}
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        enableHiding: false,
        enableSorting: false,
        size: 50,
        pinned: 'right',
      },
    ],
    [onViewBooking, onEditBooking],
  )

  // Tự động lấy các column có pinned: 'left' hoặc 'right'
  const columnPinning = useMemo<ColumnPinningState>(() => {
    const pinnedLeft = columns
      .filter((col) => (col as any).pinned === 'left')
      .map((col) => (col as any).accessorKey || (col as any).id)
    const pinnedRight = columns
      .filter((col) => (col as any).pinned === 'right')
      .map((col) => (col as any).accessorKey || (col as any).id)
    return { left: pinnedLeft, right: pinnedRight }
  }, [columns])

  // Không truyền globalFilter, không dùng onGlobalFilterChange
  const table = useReactTable({
    data,
    columns,
    state: {
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={4}
        rowCount={10}
        filterCount={3}
        withViewOptions
        withPagination
        className={className}
      />
    )
  }

  return (
    <div className={className}>
      <DataTableAdvancedToolbar table={table} className="mb-4">
        <Input
          placeholder="Tìm kiếm theo mã đơn đặt, tên khách hàng, số điện thoại..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchChange) {
              onSearchChange(inputValue)
            }
          }}
          className="max-w-sm h-8"
        />
        {table.getColumn('scheduled_pickup_timestamp') && (
          <DataTableDateFilter column={table.getColumn('scheduled_pickup_timestamp')!} title="Ngày đặt" multiple />
        )}
        {table.getColumn('status') && <DataTableStatus title="Trạng thái" paramKey="status" />}

        {searchValue && onSearchChange && (
          <Button
            type="button"
            variant="outline"
            className="border-dashed"
            size="sm"
            onClick={() => onSearchChange('')}
          >
            Xóa tìm kiếm
          </Button>
        )}
      </DataTableAdvancedToolbar>
      <DataTable table={table} />

      {/* Custom Pagination */}
      {totalCount > 0 && (
        <div className="mt-4">
          <PaginationWithLinks
            page={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            pageSearchParam="page"
            pageSizeSelectOptions={{
              pageSizeSearchParam: 'pageSize',
              pageSizeOptions: [5, 10, 20, 50],
            }}
          />
        </div>
      )}
      {/* (Create/cancel dialogs removed) */}
    </div>
  )
}

// Export types for external use
export type { Booking, BookingStatus }
