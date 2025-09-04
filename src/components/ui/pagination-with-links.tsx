import { useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link as TanStackLink, useNavigate, useSearch } from '@tanstack/react-router'

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from './pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string
    pageSizeOptions: Array<number>
  }
  totalCount: number
  pageSize: number
  page: number
  pageSearchParam?: string
}

/**
 * Navigate with TanStack Router (optimized for type-safe search params)
 * 
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
}: PaginationWithLinksProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const totalPageCount = Math.ceil(totalCount / pageSize)

  // Build search params for navigation using TanStack Router approach
  const buildSearchParams = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || 'page'
      return {
        ...search,
        [key]: newPage,
      }
    },
    [search, pageSearchParam],
  )

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || 'pageSize'
      const pageKey = pageSearchParam || 'page'

      navigate({
        to: '.',
        search: {
          ...search,
          [key]: newPageSize,
          [pageKey]: undefined, // Reset page when changing page size
        },
      })
    },
    [search, navigate, pageSizeSelectOptions?.pageSizeSearchParam, pageSearchParam],
  )

  const renderPageNumbers = () => {
    const items: Array<ReactNode> = []
    const maxVisiblePages = 5

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <TanStackLink
              to="."
              search={buildSearchParams(i)}
              className={cn(
                buttonVariants({
                  variant: page === i ? 'outline' : 'ghost',
                  size: 'icon',
                }),
              )}
            >
              {i}
            </TanStackLink>
          </PaginationItem>,
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <TanStackLink
            to="."
            search={buildSearchParams(1)}
            className={cn(
              buttonVariants({
                variant: page === 1 ? 'outline' : 'ghost',
                size: 'icon',
              }),
            )}
          >
            1
          </TanStackLink>
        </PaginationItem>,
      )

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPageCount - 1, page + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <TanStackLink
              to="."
              search={buildSearchParams(i)}
              className={cn(
                buttonVariants({
                  variant: page === i ? 'outline' : 'ghost',
                  size: 'icon',
                }),
              )}
            >
              {i}
            </TanStackLink>
          </PaginationItem>,
        )
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <TanStackLink
            to="."
            search={buildSearchParams(totalPageCount)}
            className={cn(
              buttonVariants({
                variant: page === totalPageCount ? 'outline' : 'ghost',
                size: 'icon',
              }),
            )}
          >
            {totalPageCount}
          </TanStackLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <TanStackLink
              to="."
              search={buildSearchParams(Math.max(page - 1, 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'default',
                }),
                'gap-1 px-2.5 sm:pl-2.5',
                page === 1 && 'pointer-events-none opacity-50',
              )}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:block">Trước</span>
            </TanStackLink>
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <TanStackLink
              to="."
              search={buildSearchParams(Math.min(page + 1, totalPageCount))}
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'default',
                }),
                'gap-1 px-2.5 sm:pr-2.5',
                page === totalPageCount && 'pointer-events-none opacity-50',
              )}
            >
              <span className="hidden sm:block">Tiếp theo</span>
              <ChevronRightIcon className="h-4 w-4" />
            </TanStackLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: Array<number>
  setPageSize: (newSize: number) => void
  pageSize: number
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Số lượng trên trang</span>

      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select page size">{String(pageSize)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
