import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { ConditionValueDisplay } from '@/components/surcharge/condition-value-display'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useSurchargeDetailQueries, useUpdateSurchargeMutation } from '@/queries/surcharge.queries'
import type { UpdateSurchargeRequest } from '@/schemas/surcharge.schemas'
import { UpdateSurchargeSchema } from '@/schemas/surcharge.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'

interface SurchargeEditViewProps {
  surchargeId: number
}

export function SurchargeEditView({ surchargeId }: SurchargeEditViewProps) {
  const navigate = useNavigate()
  const { data: surchargeDetail, isLoading, error } = useSurchargeDetailQueries(surchargeId)
  const surcharge = surchargeDetail?.data

  const updateSurchargeMutation = useUpdateSurchargeMutation({
    onSuccess: () => {
      navigate({ to: '/dashboard/surcharges/view/$id', params: { id: surchargeId.toString() } })
    },
    onError: (updateError) => {
      console.error('Failed to update surcharge:', updateError)
    },
  })

  const form = useForm<UpdateSurchargeRequest>({
    resolver: zodResolver(UpdateSurchargeSchema),
    // Không set defaultValues, để form.reset() handle việc này
    mode: 'onChange', // Enable validation on change
  })

  // Reset form when surcharge data loads
  React.useEffect(() => {
    if (surcharge) {
      const formData = {
        code: surcharge.code || '',
        surcharge_name: surcharge.surcharge_name || '',
        apply_to: surcharge.apply_to as 'HOST' | 'RENTER',
        default_value:
          typeof surcharge.default_value === 'string'
            ? parseFloat(surcharge.default_value) || 0
            : Number(surcharge.default_value) || 0,
        uom: surcharge.uom || '',
        apply_type: surcharge.apply_type as 'BASIC' | 'ADVANCED',
        type: surcharge.type as 'POST' | 'PRE' | 'CANCEL',
        is_active: surcharge.is_active ?? true,
        is_included_vat: surcharge.is_included_vat ?? false,
        charge_vat: surcharge.charge_vat ?? false,
        vat_percent: surcharge.vat_percent,
        order: surcharge.order || 0,
        condition_value: surcharge.condition_value || null,
      }

      // Use form.reset() to properly set all values including Select components
      form.reset(formData)
    }
  }, [surcharge, form])

  const handleBack = () => {
    navigate({ to: '/dashboard/surcharges' })
  }

  const handleView = () => {
    navigate({ to: '/dashboard/surcharges/view/$id', params: { id: surchargeId.toString() } })
  }

  const handleConditionChange = (field: string, value: any) => {
    const currentConditionValue = form.getValues('condition_value') || {}
    const updatedConditionValue = { ...currentConditionValue, [field]: value }
    form.setValue('condition_value', updatedConditionValue)
  }

  const handleSubmit = (data: UpdateSurchargeRequest) => {
    updateSurchargeMutation.mutate({ id: surchargeId, data })
  }

  if (isLoading || !surcharge) {
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
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa phụ thu</h1>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa phụ thu</h1>
            <p className="text-muted-foreground">{surcharge.surcharge_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleView}>
            Xem chi tiết
          </Button>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin cơ bản của phụ thu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mã phụ thu */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã phụ thu *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã phụ thu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tên phụ thu */}
                <FormField
                  control={form.control}
                  name="surcharge_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên phụ thu *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên phụ thu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Áp dụng cho */}
                <FormField
                  control={form.control}
                  name="apply_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Áp dụng cho *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} key={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đối tượng áp dụng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HOST">HOST</SelectItem>
                          <SelectItem value="RENTER">RENTER</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Giá trị mặc định */}
                <FormField
                  control={form.control}
                  name="default_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị mặc định *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập giá trị mặc định"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Đơn vị */}
                <FormField
                  control={form.control}
                  name="uom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập đơn vị" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loại áp dụng */}
                <FormField
                  control={form.control}
                  name="apply_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại áp dụng *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} key={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại áp dụng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BASIC">BASIC</SelectItem>
                          <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loại */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} key={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PRE">PRE</SelectItem>
                          <SelectItem value="CANCEL">CANCEL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thứ tự */}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thứ tự *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập thứ tự"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* VAT Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt VAT</CardTitle>
              <CardDescription>Cấu hình các thiết lập liên quan đến VAT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bao gồm VAT */}
                <FormField
                  control={form.control}
                  name="is_included_vat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bao gồm VAT</FormLabel>
                        <FormDescription>Phụ thu đã bao gồm VAT</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Tính VAT */}
                <FormField
                  control={form.control}
                  name="charge_vat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tính VAT</FormLabel>
                        <FormDescription>Có tính VAT cho phụ thu</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* % VAT */}
                <FormField
                  control={form.control}
                  name="vat_percent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">% VAT</FormLabel>
                        <FormDescription>Phần trăm VAT áp dụng</FormDescription>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập % VAT"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value ? Number(value) : null)
                          }}
                          className="w-24"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
              <CardDescription>Cấu hình trạng thái hoạt động</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                      <FormDescription>Phụ thu có đang hoạt động không</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Condition Value */}
          <ConditionValueDisplay
            conditionValue={form.watch('condition_value')}
            surchargeCode={form.watch('code')}
            isEditable={true}
            onConditionChange={handleConditionChange}
          />

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleBack} disabled={updateSurchargeMutation.isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateSurchargeMutation.isPending}>
              {updateSurchargeMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
