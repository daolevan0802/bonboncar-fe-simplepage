'use client'

import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingMapProps {
  /** Địa chỉ của booking để hiển thị trên bản đồ */
  address: string
  /** CSS class name cho container */
  className?: string
}

/**
 * Component hiển thị bản đồ Google Maps với địa chỉ được truyền vào
 * Tự động refresh bản đồ mỗi 5 giây để đảm bảo cập nhật vị trí mới nhất
 * Có thể pause/continue việc refresh bằng nút điều khiển
 */
export function BookingMap({ address, className }: BookingMapProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Tự động refresh bản đồ mỗi 5 giây
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 5000) // 5000ms = 5 giây

    return () => clearInterval(interval)
  }, [isPaused]) // Added isPaused to dependency array

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Tạo Google Maps embed URL với địa chỉ
  // eslint-disable-next-line no-shadow
  const getGoogleMapsUrl = (address: string): string => {
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`
  }

  // Nếu không có địa chỉ, hiển thị thông báo
  if (!address || address.trim() === '') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Vị trí đặt xe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Không có thông tin địa chỉ</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Vị trí đặt xe</CardTitle>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
          <Button variant="outline" size="sm" onClick={togglePause} className="flex items-center gap-2 bg-transparent">
            {isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Tiếp tục
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Tạm dừng
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <iframe
            key={refreshKey} // Sử dụng key để force refresh iframe
            src={getGoogleMapsUrl(address)}
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Bản đồ vị trí: ${address}`}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {isPaused ? 'Đã tạm dừng cập nhật' : 'Tự động cập nhật mỗi 5s'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
