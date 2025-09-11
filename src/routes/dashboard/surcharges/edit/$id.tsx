import { z } from 'zod'

import { SurchargeEditView } from '@/components/surcharge/surcharge-edit-view'
import { createFileRoute } from '@tanstack/react-router'

const surchargeEditSearchSchema = z.object({
  // Có thể thêm search params nếu cần
})

export const Route = createFileRoute('/dashboard/surcharges/edit/$id')({
  validateSearch: surchargeEditSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const surchargeId = Number(id)

  if (isNaN(surchargeId)) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-destructive">ID không hợp lệ</h1>
          <p className="text-muted-foreground mt-2">ID phụ thu không hợp lệ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      <SurchargeEditView surchargeId={surchargeId} />
    </div>
  )
}
