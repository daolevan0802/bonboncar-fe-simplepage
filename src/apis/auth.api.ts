import type { LoginRequest, LoginResponse } from '@/schemas/auth.schemas'
import { LoginRequestSchema, LoginResponseSchema } from '@/schemas/auth.schemas'
import { parseAndLog } from '@/schemas/log'
import http from '@/utils/http'

export const authAPI = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Validate request
    // const validatedData = LoginRequestSchema.parse(data)

    // Call API
    // const response = await http.booking_http.post<LoginResponse>('/auth/login', validatedData)

    // Validate and return response
    // return LoginResponseSchema.parse(response.data)

    try {
      const validatedData = parseAndLog(LoginRequestSchema, data, 'login')
      const response = await http.booking_http.post<LoginResponse>('/auth/login', validatedData)
      return parseAndLog(LoginResponseSchema, response.data, 'login')
    } catch (error) {
      console.error(error, 'login')
      throw error
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await http.booking_http.post('/auth/logout')
    } catch (error) {
      console.error(error, 'logout')
      throw error
    }
  },
}
