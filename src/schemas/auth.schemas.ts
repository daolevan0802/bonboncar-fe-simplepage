import { z } from 'zod'

// Login schemas
export const LoginRequestSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
})

export const LoginResponseSchema = z.object({
  email: z.string(),
  role: z.string(),
  token: z.string(),
})

// Types
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
