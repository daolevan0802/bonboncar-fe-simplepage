import { z } from 'zod'

import { dataTableConfig } from '@/configs/data-table'
import type { ExtendedColumnFilter, ExtendedColumnSort } from '@/types/data-table'

// Custom parser interface
interface Parser<T> {
  parse: (value: string) => T | null
  serialize: (value: T) => string
  eq: (a: T, b: T) => boolean
}

// Custom createParser function
const createParser = <T>(config: {
  parse: (value: string) => T | null
  serialize: (value: T) => string
  eq: (a: T, b: T) => boolean
}): Parser<T> => {
  return {
    parse: config.parse,
    serialize: config.serialize,
    eq: config.eq,
  }
}

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export const getSortingStateParser = <TData>(columnIds?: Array<string> | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value)
        const result = z.array(sortingItemSchema).safeParse(parsed)

        if (!result.success) return null

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null
        }

        return result.data as Array<ExtendedColumnSort<TData>>
      } catch {
        return null
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  })
}

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
})

export type FilterItemSchema = z.infer<typeof filterItemSchema>

export const getFiltersStateParser = <TData>(columnIds?: Array<string> | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value)
        const result = z.array(filterItemSchema).safeParse(parsed)

        if (!result.success) return null

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null
        }

        return result.data as unknown as Array<ExtendedColumnFilter<TData>>
      } catch {
        return null
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every((filter, index) => {
        const filterItem = filter as unknown as FilterItemSchema
        const bItem = b[index] as unknown as FilterItemSchema | undefined
        return (
          filter.id === b[index]?.id &&
          filterItem.value === bItem?.value &&
          filterItem.variant === bItem?.variant &&
          filterItem.operator === bItem?.operator &&
          filterItem.filterId === bItem?.filterId
        )
      }),
  })
}
