import { useEffect, useMemo, useState } from 'react'
import { Eye, MoreHorizontal } from 'lucide-react'

import { DataTable } from '@/components/table/data-table'
import { DataTableAdvancedToolbar } from '@/components/table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
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
  getDeliveryOptionColor,
  getDeliveryOptionDisplay,
  getStatusColor,
  getStatusDisplay,
} from '@/configs/badge-configs'
import { formatDateTime, getSafeValue } from '@/lib/formatters'
import type { Booking } from '@/schemas/booking.schemas'
import type { BookingStatus } from '@/schemas/enum.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

interface AffiliateBookingTableProps {
  data: Array<Booking>
  isLoading?: boolean
  onViewBooking?: (booking: Booking) => void
  onEditBooking?: (booking: Booking) => void
  className?: string
  // Pagination props for display only (PaginationWithLinks handles navigation)
  currentPage?: number
  pageSize?: number
  totalCount?: number
  // control whether to show pagination controls
  showPagination?: boolean
  // New props for search
  searchValue?: string
  onSearchChange?: (value: string) => void
  // Props for row selection and highlighting
  selectedBookingId?: number | null
  onBookingSelect?: (booking: Booking | null) => void
}

export function AffiliateBookingTable({
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
  // Row selection props
  selectedBookingId = null,
  onBookingSelect,
  // show pagination by default
  showPagination = true,
}: AffiliateBookingTableProps) {
  const [inputValue, setInputValue] = useState(searchValue)

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  const columns = useMemo<Array<ColumnDef<Booking>>>(
    () => [
      {
        accessorKey: 'booking_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã đơn đặt" />,
        cell: ({ row }) => (
          <div>
            <Copy value={getSafeValue(row.getValue('booking_id'))} className="font-medium text-blue-600" />
          </div>
        ),
        enableHiding: false,
        size: 140,
        meta: { label: 'Mã đơn đặt' },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
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
        size: 120,
        meta: { label: 'Trạng thái' },
      },
      {
        accessorKey: 'car_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên xe" />,
        cell: ({ row }) => <div className="font-medium text-green-700">{getSafeValue(row.getValue('car_name'))}</div>,
        size: 160,
        meta: { label: 'Tên xe' },
      },
      {
        accessorKey: 'user_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên khách hàng" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('user_name'))}</div>,
        size: 180,
        meta: { label: 'Tên khách hàng' },
      },
      {
        accessorKey: 'phone_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('phone_number'))}</div>,
        size: 150,
        meta: { label: 'Số điện thoại' },
      },
      {
        accessorKey: 'delivery_option',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hình thức giao xe" />,
        cell: ({ row }) => {
          const option = getSafeValue(row.getValue('delivery_option'))
          return (
            <Badge variant="outline" className={getDeliveryOptionColor()}>
              {getDeliveryOptionDisplay(option as any)}
            </Badge>
          )
        },
        size: 150,
        meta: { label: 'Hình thức giao xe' },
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
        cell: ({ row }) => (
          <div className="text-sm whitespace-nowrap">{formatDateTime(getSafeValue(row.getValue('created_at')))}</div>
        ),
        sortingFn: (a, b, columnId) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const aValue = new Date(a.getValue(columnId) as string).getTime()
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const bValue = new Date(b.getValue(columnId) as string).getTime()
          if (aValue < bValue) return 1
          if (aValue > bValue) return -1
          return 0
        },
        size: 150,
        meta: { label: 'Ngày tạo' },
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

  const table = useReactTable({
    data,
    columns,
    state: {
      columnPinning,
      rowSelection: selectedBookingId ? { [selectedBookingId.toString()]: true } : {},
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      // Handle row selection change
      if (typeof updater === 'function') {
        const newSelection = updater({})
        const selectedRowId = Object.keys(newSelection).find((key) => newSelection[key])
        if (selectedRowId && onBookingSelect) {
          const selectedBooking = data.find((booking) => booking.id.toString() === selectedRowId)
          onBookingSelect(selectedBooking || null)
        } else if (onBookingSelect) {
          onBookingSelect(null)
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(totalCount / pageSize),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={7}
        rowCount={10}
        filterCount={2}
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
      <DataTable
        table={table}
        onRowClick={(row) => {
          // Toggle row selection when clicking on a row
          if (onBookingSelect) {
            const booking = row.original as Booking
            if (selectedBookingId === booking.id) {
              // If clicking on the same row, deselect it
              onBookingSelect(null)
            } else {
              // Select the clicked row
              onBookingSelect(booking)
            }
          }
        }}
      />

      {/* Custom Pagination */}
      {showPagination && totalCount > 0 && (
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
    </div>
  )
}

// Export types for external use
export type { Booking, BookingStatus }
