import { useMemo, useState } from 'react'

import { SimplifiedBookingTable } from '@/components/booking/simplified-booking-table'
import { DataTableAdvancedToolbar } from '@/components/table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DataTableSkeleton } from '@/components/table/data-table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from '@/components/ui/copy'
import { Input } from '@/components/ui/input'
import { PaginationWithLinks } from '@/components/ui/pagination-with-links'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getCommonPinningStyles } from '@/lib/data-table'
import { getSafeValue } from '@/lib/formatters'
import type { AffiliateData } from '@/schemas/affiliate.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

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

  const columns = useMemo<Array<ColumnDef<AffiliateData>>>(
    () => [
      {
        accessorKey: 'affiliate_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã giới thiệu" />,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đại lý" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('affiliate_name'))}</div>,
        enableHiding: false,
        size: 200,
        meta: { label: 'Tên đại lý' },
      },
      {
        accessorKey: 'affiliate_phone',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('affiliate_phone'))}</div>,
        size: 150,
        meta: { label: 'Số điện thoại' },
      },
      {
        accessorKey: 'affiliate_email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('affiliate_email'))}</div>,
        size: 200,
        meta: { label: 'Email' },
      },
      {
        accessorKey: 'city',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thành phố" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('city')) || 'N/A'}</div>,
        size: 120,
        meta: { label: 'Thành phố' },
      },
      {
        accessorKey: 'bookings',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng đơn" />,
        cell: ({ row }) => <div className="text-sm">{row.original.bookings?.length || 0} đơn</div>,
        size: 100,
        meta: { label: 'Tổng đơn' },
      },
    ],
    [],
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
    getSortedRowModel: getSortedRowModel(),
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
