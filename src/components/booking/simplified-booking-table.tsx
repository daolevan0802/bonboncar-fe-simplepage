import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronsUpDown, ChevronUp, X } from 'lucide-react'

import { DataTable } from '@/components/table/data-table'
import { DataTableAdvancedToolbar } from '@/components/table/data-table-advanced-toolbar'
import { DataTableSkeleton } from '@/components/table/data-table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy } from '@/components/ui/copy'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'

interface SimplifiedBookingTableProps {
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
  // Sorting props
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  onSortChange?: (sortBy?: string, sortOrder?: 'ASC' | 'DESC') => void
}

export function SimplifiedBookingTable({
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
  // Sorting props
  sortBy,
  sortOrder,
  onSortChange,
}: SimplifiedBookingTableProps) {
  const [inputValue, setInputValue] = useState(searchValue)

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  // Custom column header component for server-side sorting with Vietnamese labels
  const ServerSortableHeader = ({ title, accessorKey }: { title: string; accessorKey: string }) => {
    const isSorted = sortBy === accessorKey
    const isAsc = isSorted && sortOrder === 'ASC'
    const isDesc = isSorted && sortOrder === 'DESC'

    const handleSort = (direction: 'asc' | 'desc' | 'clear') => {
      if (!onSortChange) return

      if (direction === 'asc') {
        onSortChange(accessorKey, 'ASC')
      } else if (direction === 'desc') {
        onSortChange(accessorKey, 'DESC')
      } else {
        onSortChange(undefined, undefined)
      }
    }

    return (
      <div className="flex items-center gap-1">
        <span className="font-medium">{title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-accent rounded-md px-1 py-1">
            {isAsc && <ChevronUp className="h-4 w-4" />}
            {isDesc && <ChevronDown className="h-4 w-4" />}
            {!isSorted && <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-28">
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={isAsc}
              onClick={() => handleSort('asc')}
            >
              <ChevronUp />
              Tăng dần
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={isDesc}
              onClick={() => handleSort('desc')}
            >
              <ChevronDown />
              Giảm dần
            </DropdownMenuCheckboxItem>
            {isSorted && (
              <DropdownMenuItem className="pl-2 [&_svg]:text-muted-foreground" onClick={() => handleSort('clear')}>
                <X />
                Đặt lại
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  const columns = useMemo<Array<ColumnDef<Booking>>>(
    () => [
      {
        accessorKey: 'booking_id',
        header: () => <ServerSortableHeader title="Mã đơn đặt" accessorKey="booking_id" />,
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
        header: () => <ServerSortableHeader title="Trạng thái" accessorKey="status" />,
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
        header: () => <ServerSortableHeader title="Tên xe" accessorKey="car_name" />,
        cell: ({ row }) => <div className="font-medium text-green-700">{getSafeValue(row.getValue('car_name'))}</div>,
        size: 160,
        meta: { label: 'Tên xe' },
      },
      {
        accessorKey: 'user_name',
        header: () => <ServerSortableHeader title="Tên khách hàng" accessorKey="user_name" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('user_name'))}</div>,
        size: 180,
        meta: { label: 'Tên khách hàng' },
      },
      {
        accessorKey: 'phone_number',
        header: () => <ServerSortableHeader title="Số điện thoại" accessorKey="phone_number" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('phone_number'))}</div>,
        size: 150,
        meta: { label: 'Số điện thoại' },
      },
      {
        accessorKey: 'delivery_option',
        header: () => <ServerSortableHeader title="Hình thức giao xe" accessorKey="delivery_option" />,
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
        accessorKey: 'amount_to_pay',
        header: () => <ServerSortableHeader title="Số tiền" accessorKey="amount_to_pay" />,
        cell: ({ row }) => {
          const amount = row.getValue('amount_to_pay')
          return (
            <div className="text-sm font-medium">
              {amount && typeof amount === 'number' ? `${amount.toLocaleString('vi-VN')} VNĐ` : 'Không có'}
            </div>
          )
        },
        size: 150,
        meta: { label: 'Số tiền' },
      },
      {
        accessorKey: 'created_at',
        header: () => <ServerSortableHeader title="Ngày tạo" accessorKey="created_at" />,
        cell: ({ row }) => (
          <div className="text-sm whitespace-nowrap">{formatDateTime(getSafeValue(row.getValue('created_at')))}</div>
        ),
        size: 150,
        meta: { label: 'Ngày tạo' },
      },
    ],
    [onViewBooking, onEditBooking, sortBy, sortOrder, onSortChange],
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
    // Disable client-side sorting since we're using server-side sorting
    manualSorting: true,
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
