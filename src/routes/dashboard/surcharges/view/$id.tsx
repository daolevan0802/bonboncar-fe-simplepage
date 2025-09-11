import { z } from 'zod'

import { SurchargeDetailView } from '@/components/surcharge/surcharge-detail-view'
import { createFileRoute } from '@tanstack/react-router'

const surchargeViewSearchSchema = z.object({
  // Có thể thêm search params nếu cần
})

export const Route = createFileRoute('/dashboard/surcharges/view/$id')({
  validateSearch: surchargeViewSearchSchema,
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
      <SurchargeDetailView surchargeId={surchargeId} />
    </div>
  )
}
