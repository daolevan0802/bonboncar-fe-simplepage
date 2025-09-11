import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronsUpDown, ChevronUp, Eye, MoreHorizontal, Pencil, X } from 'lucide-react'

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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { PaginationWithLinks } from '@/components/ui/pagination-with-links'
import { getSafeValue } from '@/lib/formatters'
import type { Surcharge } from '@/schemas/surcharge.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'

interface SurchargeTableProps {
  data: Array<Surcharge>
  isLoading?: boolean
  className?: string
  // Pagination props for display only
  currentPage?: number
  pageSize?: number
  totalCount?: number
  // Search props
  searchValue?: string
  onSearchChange?: (value: string) => void
  // Sorting props
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  onSortChange?: (sortBy?: string, sortOrder?: 'ASC' | 'DESC') => void
  // Action handlers
  onViewSurcharge?: (surcharge: Surcharge) => void
  onEditSurcharge?: (surcharge: Surcharge) => void
}

export function SurchargeTable({
  data,
  isLoading = false,
  className,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  searchValue = '',
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  onViewSurcharge,
  onEditSurcharge,
}: SurchargeTableProps) {
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

  const columns = useMemo<Array<ColumnDef<Surcharge>>>(
    () => [
      {
        accessorKey: 'id',
        header: () => <ServerSortableHeader title="ID" accessorKey="id" />,
        cell: ({ row }) => <div className="font-mono text-sm text-gray-600">{row.getValue('id')}</div>,
        enableHiding: false,
        size: 80,
        meta: { label: 'ID' },
      },
      {
        accessorKey: 'code',
        header: () => <ServerSortableHeader title="Mã phụ thu" accessorKey="code" />,
        cell: ({ row }) => (
          <div>
            <Copy value={getSafeValue(row.getValue('code'))} className="font-medium text-blue-600" />
          </div>
        ),
        enableHiding: false,
        size: 140,
        meta: { label: 'Mã phụ thu' },
      },
      {
        accessorKey: 'surcharge_name',
        header: () => <ServerSortableHeader title="Tên phụ thu" accessorKey="surcharge_name" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('surcharge_name'))}</div>,
        enableHiding: false,
        size: 200,
        meta: { label: 'Tên phụ thu' },
      },
      {
        accessorKey: 'apply_to',
        header: () => <ServerSortableHeader title="Áp dụng cho" accessorKey="apply_to" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('apply_to'))}</div>,
        size: 150,
        meta: { label: 'Áp dụng cho' },
      },
      {
        accessorKey: 'default_value',
        header: () => <ServerSortableHeader title="Giá trị mặc định" accessorKey="default_value" />,
        cell: ({ row }) => <div className="text-sm font-mono">{getSafeValue(row.getValue('default_value'))}</div>,
        size: 150,
        meta: { label: 'Giá trị mặc định' },
      },
      {
        accessorKey: 'uom',
        header: () => <ServerSortableHeader title="Đơn vị" accessorKey="uom" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('uom'))}</div>,
        size: 100,
        meta: { label: 'Đơn vị' },
      },
      {
        accessorKey: 'apply_type',
        header: () => <ServerSortableHeader title="Loại áp dụng" accessorKey="apply_type" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('apply_type'))}</div>,
        size: 150,
        meta: { label: 'Loại áp dụng' },
      },
      {
        accessorKey: 'type',
        header: () => <ServerSortableHeader title="Loại" accessorKey="type" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('type'))}</div>,
        size: 120,
        meta: { label: 'Loại' },
      },
      {
        accessorKey: 'is_active',
        header: () => <div className="font-medium">Trạng thái</div>,
        cell: ({ row }) => {
          const isActive = row.getValue('is_active')
          return (
            <Badge
              variant="outline"
              className={
                isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }
            >
              {isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          )
        },
        size: 120,
        meta: { label: 'Trạng thái' },
        enableSorting: false,
      },
      {
        accessorKey: 'is_included_vat',
        header: () => <div className="font-medium">Bao gồm VAT</div>,
        cell: ({ row }) => {
          const isIncludedVat = row.getValue('is_included_vat')
          return (
            <Badge
              variant="outline"
              className={
                isIncludedVat ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }
            >
              {isIncludedVat ? 'Có' : 'Không'}
            </Badge>
          )
        },
        size: 120,
        meta: { label: 'Bao gồm VAT' },
        enableSorting: false,
      },
      {
        accessorKey: 'charge_vat',
        header: () => <div className="font-medium">Tính VAT</div>,
        cell: ({ row }) => {
          const chargeVat = row.getValue('charge_vat')
          return (
            <Badge
              variant="outline"
              className={
                chargeVat ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }
            >
              {chargeVat ? 'Có' : 'Không'}
            </Badge>
          )
        },
        size: 120,
        meta: { label: 'Tính VAT' },
        enableSorting: false,
      },
      {
        accessorKey: 'vat_percent',
        header: () => <div className="font-medium">% VAT</div>,
        cell: ({ row }) => {
          const vatPercent = row.getValue('vat_percent')
          return <div className="text-sm">{vatPercent !== null ? `${vatPercent}%` : 'Không có'}</div>
        },
        size: 100,
        meta: { label: '% VAT' },
        enableSorting: false,
      },
      {
        accessorKey: 'order',
        header: () => <ServerSortableHeader title="Thứ tự" accessorKey="order" />,
        cell: ({ row }) => <div className="text-sm font-mono">{row.getValue('order')}</div>,
        size: 100,
        meta: { label: 'Thứ tự' },
      },
      {
        accessorKey: 'condition_value',
        header: () => <div className="font-medium">Điều kiện</div>,
        cell: ({ row }) => {
          const conditionValue = row.getValue('condition_value')
          if (!conditionValue || (typeof conditionValue === 'object' && Object.keys(conditionValue).length === 0)) {
            return (
              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                Không có
              </Badge>
            )
          }

          // Count number of conditions
          const conditionCount = Object.keys(conditionValue).length
          return (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {conditionCount} điều kiện
            </Badge>
          )
        },
        size: 120,
        meta: { label: 'Điều kiện' },
        enableSorting: false,
      },
      // Actions column
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const surcharge = row.original
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
                {onViewSurcharge && (
                  <DropdownMenuItem onClick={() => onViewSurcharge(surcharge)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                  </DropdownMenuItem>
                )}
                {onEditSurcharge && (
                  <DropdownMenuItem onClick={() => onEditSurcharge(surcharge)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Cập nhật
                  </DropdownMenuItem>
                )}
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
    [sortBy, sortOrder, onSortChange, onViewSurcharge, onEditSurcharge],
  )

  // Get pinned columns
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
        columnCount={9}
        rowCount={10}
        filterCount={1}
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
          placeholder="Tìm kiếm theo mã, tên phụ thu..."
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
    </div>
  )
}
