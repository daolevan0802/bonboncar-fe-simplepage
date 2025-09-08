import { ArrowLeft, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found/')({
  component: NotFoundComponent,
})

function NotFoundComponent() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-red-600">404</span>
          </div>
          <CardTitle className="text-2xl font-bold">Trang không tìm thấy</CardTitle>
          <CardDescription>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button onClick={handleGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
