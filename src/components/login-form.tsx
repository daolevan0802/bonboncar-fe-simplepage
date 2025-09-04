import { useForm } from 'react-hook-form'

import images from '@/assets/images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLoginMutation } from '@/queries/auth.queries'
import type { LoginRequest } from '@/schemas/auth.schemas'
import { LoginRequestSchema } from '@/schemas/auth.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginRequest) => {
    // console.log(data)
    loginMutation.mutateAsync(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">Đăng nhập để dùng CMS-V3</p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="M@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link to="." className="ml-auto text-sm underline-offset-2 hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} placeholder="Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
                <div className="text-center text-sm">
                  Chưa có tài khoản?{' '}
                  <Link to="." className="underline underline-offset-4">
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={images.login}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Khi sử dụng CMS-V3, bạn sẽ đồng ý với <Link to=".">Điều khoản dịch vụ</Link> và{' '}
        <Link to=".">Chính sách bảo mật</Link>.
      </div>
    </div>
  )
}
