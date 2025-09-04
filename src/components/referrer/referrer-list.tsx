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
import mockBookings from '@/mocks/mockBookingData'
import type { Referrer } from '@/schemas/referrer.schemas'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface ReferrerListProps {
  data: Array<Referrer>
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

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'INACTIVE':
      return 'text-red-700 bg-red-50 border-red-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

// Helper function to get status display text
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động'
    case 'INACTIVE':
      return 'Không hoạt động'
    default:
      return status
  }
}

// Helper function to format currency

export function ReferrerList({
  data,
  isLoading = false,
  className,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  searchValue = '',
  onSearchChange,
}: ReferrerListProps) {
  const [inputValue, setInputValue] = useState(searchValue)
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null)

  const handleReferrerSelect = (referrer: Referrer) => {
    setSelectedReferrer(referrer)
  }

  const handleReferrerDeselect = () => {
    setSelectedReferrer(null)
  }

  // Filter bookings based on selected referrer
  const filteredBookings = useMemo(() => {
    if (!selectedReferrer) return []
    return mockBookings.filter((booking) => booking.referralCode === selectedReferrer.referralCode)
  }, [selectedReferrer])

  const columns = useMemo<Array<ColumnDef<Referrer>>>(
    () => [
      {
        accessorKey: 'referralCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã giới thiệu" />,
        cell: ({ row }) => (
          <div>
            <Copy value={getSafeValue(row.getValue('referralCode'))} className="font-medium text-blue-600" />
          </div>
        ),
        enableHiding: false,
        size: 140,
        meta: { label: 'Mã giới thiệu' },
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đại lý" />,
        cell: ({ row }) => <div className="font-medium">{getSafeValue(row.getValue('name'))}</div>,
        enableHiding: false,
        size: 200,
        meta: { label: 'Tên đại lý' },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
          const status = String(row.getValue('status'))
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
        accessorKey: 'phone',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('phone'))}</div>,
        size: 150,
        meta: { label: 'Số điện thoại' },
      },
      {
        accessorKey: 'totalBookings',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng đơn" />,
        cell: ({ row }) => <div className="text-sm">{getSafeValue(row.getValue('totalBookings'))} đơn</div>,
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

  // Show the referrer list with booking table below
  return (
    <div className={className}>
      {/* Referrer Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Danh sách đại lý</CardTitle>
          <CardDescription>{totalCount ? `Tổng cộng ${totalCount} đại lý` : 'Đang tải...'}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvancedToolbar table={table} className="mb-4">
            <Input
              placeholder="Tìm kiếm theo tên, mã giới thiệu, email..."
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

          <div className="mb-2 text-sm text-muted-foreground">
            💡 Nhấp vào một dòng trong bảng để chọn đại lý và xem đơn đặt xe
          </div>
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
                        const referrer = row.original
                        const isSelected = selectedReferrer?.id === referrer.id
                        return (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary/10 border-primary/20 hover:bg-primary/15' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleReferrerSelect(referrer)}
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
            {selectedReferrer && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                - Đại lý: {selectedReferrer.name} ({selectedReferrer.referralCode})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {selectedReferrer
              ? `Hiển thị đơn đặt xe của đại lý ${selectedReferrer.name}`
              : 'Vui lòng chọn một đại lý từ bảng trên để xem đơn đặt xe'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedReferrer ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground text-lg mb-2">Chưa chọn đại lý</div>
              <p className="text-sm text-muted-foreground">
                Nhấp vào một dòng trong bảng đại lý ở trên để xem đơn đặt xe
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedReferrer.referralCode}</Badge>
                  <span className="text-sm text-muted-foreground">{selectedReferrer.totalBookings} đơn đặt xe</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleReferrerDeselect}>
                  Bỏ chọn
                </Button>
              </div>

              <SimplifiedBookingTable
                data={filteredBookings}
                isLoading={false}
                currentPage={1}
                pageSize={10}
                totalCount={filteredBookings.length}
                searchValue=""
                onSearchChange={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
