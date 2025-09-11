import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ConditionValueDisplayProps {
  conditionValue: any
  surchargeCode?: string
  isEditable?: boolean
  onConditionChange?: (field: string, value: any) => void
}

export function ConditionValueDisplay({
  conditionValue,
  surchargeCode,
  isEditable = false,
  onConditionChange,
}: ConditionValueDisplayProps) {
  if (!conditionValue || (typeof conditionValue === 'object' && Object.keys(conditionValue).length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Điều kiện</CardTitle>
          <CardDescription>Không có điều kiện đặc biệt</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Phụ thu này không có điều kiện áp dụng đặc biệt.</p>
        </CardContent>
      </Card>
    )
  }

  const renderConditionFields = () => {
    const fields = []

    // Delivery fee conditions
    if (conditionValue.minDeliveryFee !== undefined) {
      fields.push(
        <div key="minDeliveryFee" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Phí giao tối thiểu</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.minDeliveryFee}
                onChange={(e) => onConditionChange?.('minDeliveryFee', Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-sm text-muted-foreground">VNĐ</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.minDeliveryFee.toLocaleString('vi-VN')} VNĐ</span>
          )}
        </div>,
      )
    }

    if (conditionValue.feePerKm !== undefined) {
      fields.push(
        <div key="feePerKm" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Phí mỗi km</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.feePerKm}
                onChange={(e) => onConditionChange?.('feePerKm', Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-sm text-muted-foreground">VNĐ/km</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.feePerKm.toLocaleString('vi-VN')} VNĐ/km</span>
          )}
        </div>,
      )
    }

    if (conditionValue.distanceMultiplier !== undefined) {
      fields.push(
        <div key="distanceMultiplier" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Hệ số khoảng cách</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={conditionValue.distanceMultiplier}
                onChange={(e) => onConditionChange?.('distanceMultiplier', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">x</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.distanceMultiplier}x</span>
          )}
        </div>,
      )
    }

    if (conditionValue.minDistanceForDiscount !== undefined) {
      fields.push(
        <div key="minDistanceForDiscount" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Khoảng cách tối thiểu để giảm giá</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.minDistanceForDiscount}
                onChange={(e) => onConditionChange?.('minDistanceForDiscount', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">km</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.minDistanceForDiscount} km</span>
          )}
        </div>,
      )
    }

    if (conditionValue.maxDistanceForDiscount !== undefined) {
      fields.push(
        <div key="maxDistanceForDiscount" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Khoảng cách tối đa để giảm giá</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.maxDistanceForDiscount}
                onChange={(e) => onConditionChange?.('maxDistanceForDiscount', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">km</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.maxDistanceForDiscount} km</span>
          )}
        </div>,
      )
    }

    if (conditionValue.minBookingPriceForDiscount !== undefined) {
      fields.push(
        <div key="minBookingPriceForDiscount" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Giá đặt xe tối thiểu để giảm giá</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.minBookingPriceForDiscount}
                onChange={(e) => onConditionChange?.('minBookingPriceForDiscount', Number(e.target.value))}
                className="w-40 text-right"
              />
              <span className="text-sm text-muted-foreground">VNĐ</span>
            </div>
          ) : (
            <span className="text-sm font-mono">
              {conditionValue.minBookingPriceForDiscount.toLocaleString('vi-VN')} VNĐ
            </span>
          )}
        </div>,
      )
    }

    if (conditionValue.discountPercent !== undefined) {
      fields.push(
        <div key="discountPercent" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Phần trăm giảm giá</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.discountPercent}
                onChange={(e) => onConditionChange?.('discountPercent', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          ) : (
            <span className="text-sm font-mono text-green-600">{conditionValue.discountPercent}%</span>
          )}
        </div>,
      )
    }

    // Cleaning fee conditions (car types)
    if (conditionValue.Sedan5 !== undefined || conditionValue.SUV5 !== undefined || conditionValue.SUV7 !== undefined) {
      const carTypes = [
        { key: 'Sedan5', label: 'Sedan 5 chỗ' },
        { key: 'SUV5', label: 'SUV 5 chỗ' },
        { key: 'SUV7', label: 'SUV 7 chỗ' },
        { key: 'MPV7', label: 'MPV 7 chỗ' },
        { key: 'HatchBack', label: 'Hatchback' },
        { key: 'MiniVan', label: 'Minivan' },
        { key: 'BanTai', label: 'Bán tải' },
      ]

      carTypes.forEach(({ key, label }) => {
        if (conditionValue[key] !== undefined) {
          fields.push(
            <div key={key} className="flex justify-between items-center py-2 border-b">
              <Label className="text-sm font-medium">{label}</Label>
              {isEditable ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={conditionValue[key]}
                    onChange={(e) => onConditionChange?.(key, Number(e.target.value))}
                    className="w-32 text-right"
                  />
                  <span className="text-sm text-muted-foreground">VNĐ</span>
                </div>
              ) : (
                <span className="text-sm font-mono">{conditionValue[key].toLocaleString('vi-VN')} VNĐ</span>
              )}
            </div>,
          )
        }
      })
    }

    // Late return fee
    if (conditionValue.percentageOfRent24Hour !== undefined) {
      fields.push(
        <div key="percentageOfRent24Hour" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Phần trăm giá thuê 24h</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.percentageOfRent24Hour}
                onChange={(e) => onConditionChange?.('percentageOfRent24Hour', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.percentageOfRent24Hour}%</span>
          )}
        </div>,
      )
    }

    // Cancellation fee
    if (conditionValue.percentageOfRent !== undefined) {
      fields.push(
        <div key="percentageOfRent" className="flex justify-between items-center py-2 border-b">
          <Label className="text-sm font-medium">Phần trăm giá thuê</Label>
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={conditionValue.percentageOfRent}
                onChange={(e) => onConditionChange?.('percentageOfRent', Number(e.target.value))}
                className="w-24 text-right"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          ) : (
            <span className="text-sm font-mono">{conditionValue.percentageOfRent}%</span>
          )}
        </div>,
      )
    }

    // If no known fields, show raw data
    if (fields.length === 0) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Dữ liệu điều kiện:</p>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(conditionValue, null, 2)}</pre>
        </div>
      )
    }

    return <div className="space-y-1">{fields}</div>
  }

  const getConditionTitle = () => {
    if (surchargeCode?.includes('delivery_fee')) {
      return 'Điều kiện phí giao xe'
    }
    if (surchargeCode?.includes('cleaning')) {
      return 'Điều kiện phí vệ sinh theo loại xe'
    }
    if (surchargeCode?.includes('late_return')) {
      return 'Điều kiện phí trả trễ'
    }
    if (surchargeCode?.includes('cancellation')) {
      return 'Điều kiện phí hủy chuyến'
    }
    return 'Điều kiện áp dụng'
  }

  const getConditionDescription = () => {
    if (surchargeCode?.includes('delivery_fee')) {
      return 'Các điều kiện tính phí giao xe và giảm giá'
    }
    if (surchargeCode?.includes('cleaning')) {
      return 'Phí vệ sinh theo từng loại xe'
    }
    if (surchargeCode?.includes('late_return')) {
      return 'Tính phí trả trễ dựa trên phần trăm giá thuê'
    }
    if (surchargeCode?.includes('cancellation')) {
      return 'Tính phí hủy chuyến dựa trên phần trăm giá thuê'
    }
    return 'Các điều kiện áp dụng phụ thu'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getConditionTitle()}</CardTitle>
        <CardDescription>{getConditionDescription()}</CardDescription>
      </CardHeader>
      <CardContent>{renderConditionFields()}</CardContent>
    </Card>
  )
}
