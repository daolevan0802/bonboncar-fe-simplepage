import { useMemo, useState } from 'react'
import { ChevronDown, ChevronsUpDown, ChevronUp, X } from 'lucide-react'

import { SimplifiedBookingTable } from '@/components/booking/simplified-booking-table'
import { DataTableAdvancedToolbar } from '@/components/table/data-table-advanced-toolbar'
import { DataTableSkeleton } from '@/components/table/data-table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getCommonPinningStyles } from '@/lib/data-table'
import { getSafeValue } from '@/lib/formatters'
import type { AffiliateData } from '@/schemas/affiliate.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'

interface AffiliateListProps {
  data: Array<AffiliateData>
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
}

export function AffiliateList({
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
}: AffiliateListProps) {
  const [inputValue, setInputValue] = useState(searchValue)
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateData | null>(null)

  const handleAffiliateSelect = (affiliate: AffiliateData) => {
    setSelectedAffiliate(affiliate)
  }

  // Filter bookings based on selected affiliate
  const filteredBookings = useMemo(() => {
    if (!selectedAffiliate) return []
    return selectedAffiliate.bookings || []
  }, [selectedAffiliate])

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

  const columns = useMemo<Array<ColumnDef<AffiliateData>>>(
    () => [
      {
        accessorKey: 'affiliate_code',
        header: () => <ServerSortableHeader title="Mã giới thiệu" accessorKey="affiliate_code" />,
        cell: ({ row }) => (
          <div>
            <Copy value={getSafeValue(row.getValue('affiliate_code'))} className="font-medium text-blue-600" />
          </div>
        ),
        enableHiding: false,
        size: 140,
        meta: { label: 'Mã giới thiệu' },
      },
      {
        accessorKey: 'affiliate_name',
        header: () => <ServerSortableHeader title="Tên đại lý" accessorKey="affiliate_name" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('affiliate_name'))}</div>,
        enableHiding: false,
        size: 200,
        meta: { label: 'Tên đại lý' },
      },
      {
        accessorKey: 'affiliate_phone',
        header: () => <ServerSortableHeader title="Số điện thoại" accessorKey="affiliate_phone" />,
        cell: ({ row }) => {
          const phone = getSafeValue(row.getValue('affiliate_phone'))
          return phone ? (
            <Copy value={phone} className="text-sm text-blue-600" />
          ) : (
            <div className="text-sm text-muted-foreground">Không có</div>
          )
        },
        size: 150,
        meta: { label: 'Số điện thoại' },
      },
      {
        accessorKey: 'affiliate_email',
        header: () => <ServerSortableHeader title="Email" accessorKey="affiliate_email" />,
        cell: ({ row }) => {
          const email = getSafeValue(row.getValue('affiliate_email'))
          return email ? (
            <Copy value={email} className="text-sm text-blue-600" />
          ) : (
            <div className="text-sm text-muted-foreground">Không có</div>
          )
        },
        size: 200,
        meta: { label: 'Email' },
      },
      {
        accessorKey: 'city',
        header: () => <ServerSortableHeader title="Thành phố" accessorKey="city" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('city')) || 'Không có'}</div>,
        size: 120,
        meta: { label: 'Thành phố' },
      },
      {
        accessorKey: 'created_at',
        header: () => <ServerSortableHeader title="Ngày tạo" accessorKey="created_at" />,
        cell: ({ row }) => {
          const createdAt = getSafeValue(row.getValue('created_at'))
          return (
            <div className="text-sm">{createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : 'Không có'}</div>
          )
        },
        size: 120,
        meta: { label: 'Ngày tạo' },
      },
      {
        accessorKey: 'bookings_count',
        header: () => <div className="font-medium">Tổng đơn</div>,
        cell: ({ row }) => <div className="text-sm">{row.original.bookings?.length || 0} đơn</div>,
        size: 100,
        meta: { label: 'Tổng đơn' },
        enableSorting: false,
      },
    ],
    [sortBy, sortOrder, onSortChange],
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

  // Show the affiliate list with booking table below
  return (
    <div className={className}>
      {/* Affiliate Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Danh sách đại lý</CardTitle>
          <CardDescription>{totalCount ? `Tổng cộng ${totalCount} đại lý` : 'Đang tải...'}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvancedToolbar table={table} className="mb-4">
            <Input
              placeholder="Tìm kiếm theo tên, mã đại lý, email..."
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

          <div className="border rounded-md">
            {isLoading ? (
              <DataTableSkeleton
                columnCount={5}
                rowCount={5}
                filterCount={0}
                withViewOptions={false}
                withPagination={false}
                className="p-4"
              />
            ) : (
              <div className="overflow-hidden rounded-md">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{
                              ...getCommonPinningStyles({ column: header.column }),
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => {
                        const affiliate = row.original
                        const isSelected = selectedAffiliate?.id === affiliate.id
                        return (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary/10 border-primary/20 hover:bg-primary/15' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleAffiliateSelect(affiliate)}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className={isSelected ? 'bg-primary/10' : ''}
                                style={{
                                  ...getCommonPinningStyles({ column: cell.column }),
                                }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={table.getAllColumns().length} className="h-24 text-start">
                          Không có kết quả.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

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
        </CardContent>
      </Card>

      {/* Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách đơn đặt xe
            {selectedAffiliate && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                - Đại lý: {selectedAffiliate.affiliate_name} ({selectedAffiliate.affiliate_code})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {selectedAffiliate
              ? `Hiển thị đơn đặt xe của đại lý ${selectedAffiliate.affiliate_name}`
              : 'Vui lòng chọn một đại lý từ bảng trên để xem đơn đặt xe'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedAffiliate ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground text-lg mb-2">Chưa chọn đại lý</div>
              <p className="text-sm text-muted-foreground">
                Nhấp vào một dòng trong bảng đại lý ở trên để xem đơn đặt xe
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedAffiliate.affiliate_code}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedAffiliate.bookings?.length || 0} đơn đặt xe
                  </span>
                </div>
              </div>

              {/* Use the simplified booking table without pagination */}
              <SimplifiedBookingTable
                data={filteredBookings as any} // Type assertion to bypass type error, ensure data shape matches expected type in SimplifiedBookingTable
                isLoading={isLoading}
                className="w-full"
                // disable pagination for affiliate page
                showPagination={false}
                selectedBookingId={null}
                onBookingSelect={() => {
                  /* no-op or could open detail in future */
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
