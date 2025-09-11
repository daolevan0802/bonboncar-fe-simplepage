import { ArrowLeft } from 'lucide-react'

import { ConditionValueDisplay } from '@/components/surcharge/condition-value-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSurchargeDetailQueries } from '@/queries/surcharge.queries'
import { useNavigate } from '@tanstack/react-router'

interface SurchargeDetailViewProps {
  surchargeId: number
}

export function SurchargeDetailView({ surchargeId }: SurchargeDetailViewProps) {
  const navigate = useNavigate()
  const { data: surchargeDetail, isLoading, error } = useSurchargeDetailQueries(surchargeId)
  const surcharge = surchargeDetail?.data

  const handleBack = () => {
    navigate({ to: '/dashboard/surcharges' })
  }

  const handleEdit = () => {
    navigate({ to: '/dashboard/surcharges/edit/$id', params: { id: surchargeId.toString() } })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết phụ thu</h1>
            <p className="text-muted-foreground">Không thể tải thông tin phụ thu</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-destructive mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
              <Button onClick={handleBack}>Quay lại</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!surcharge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết phụ thu</h1>
            <p className="text-muted-foreground">Không tìm thấy thông tin phụ thu</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Không tìm thấy thông tin phụ thu</p>
              <Button onClick={handleBack}>Quay lại</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết phụ thu</h1>
            <p className="text-muted-foreground">{surcharge.surcharge_name}</p>
          </div>
        </div>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin chi tiết về phụ thu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mã phụ thu</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{surcharge.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên phụ thu</label>
                <p className="text-sm mt-1">{surcharge.surcharge_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Áp dụng cho</label>
                <p className="text-sm mt-1">{surcharge.apply_to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giá trị mặc định</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{surcharge.default_value}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Đơn vị</label>
                <p className="text-sm mt-1">{surcharge.uom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loại áp dụng</label>
                <p className="text-sm mt-1">{surcharge.apply_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loại</label>
                <p className="text-sm mt-1">{surcharge.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Thứ tự</label>
                <p className="text-sm font-mono mt-1">{surcharge.order}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái</CardTitle>
          <CardDescription>Trạng thái hoạt động và cài đặt VAT</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Trạng thái hoạt động</label>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={
                    surcharge.is_active
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }
                >
                  {surcharge.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bao gồm VAT</label>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={
                    surcharge.is_included_vat
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  {surcharge.is_included_vat ? 'Có' : 'Không'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tính VAT</label>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={
                    surcharge.charge_vat
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  {surcharge.charge_vat ? 'Có' : 'Không'}
                </Badge>
              </div>
            </div>
          </div>

          {/* VAT Information */}
          {surcharge.vat_percent !== null && (
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">% VAT</label>
              <div className="mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {surcharge.vat_percent}%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Condition Value */}
      <ConditionValueDisplay conditionValue={surcharge.condition_value} surchargeCode={surcharge.code} />
    </div>
  )
}
