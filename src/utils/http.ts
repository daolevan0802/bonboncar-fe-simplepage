import type { AxiosError, AxiosInstance } from 'axios'
import axios from 'axios'

import configs from '@/configs'
import type { LoginResponse } from '@/schemas/auth.schemas'
import { HTTP_STATUS } from '@/utils/constants'
import { getToken, removeToken, setToken } from '@/utils/cookies'

export const app_config = {
  base_url:
    import.meta.env.VITE_BOOKING_API || 'https://bonbon-booking-api-staging-108013449433.asia-southeast1.run.app',
  api_key: import.meta.env.VITE_BOOKING_API_KEY || 'c189bd6938b08c1c355bca3641539417c06b6f4e22705f7d8301ac68eb762de2',
  cronjob_api_url:
    import.meta.env.VITE_CRONJOB_API_URL || 'https://bonbon-cronjob-108013449433.asia-southeast1.run.app',
  cronjob_api_key:
    import.meta.env.VITE_CRONJOB_API_KEY || '553290d7025238058f2ed9bf540f5cfe8ce1e1813b1a94f46c4bc1eb70d07e49',
}

class Http {
  private token: string
  instance: AxiosInstance

  constructor() {
    this.token = getToken()
    this.instance = axios.create({
      // baseURL: `${app_config.base_url}/api/v1`,
      baseURL: 'http://localhost:3000/api/v1/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': app_config.api_key,
      },
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config

        if (method === 'post' && url?.includes(configs.routes.login)) {
          const loginResponse = response.data as LoginResponse
          if (loginResponse && loginResponse.token && loginResponse.token.trim() !== '') {
            this.token = loginResponse.token
            setToken(this.token)
          }
        } else if (url === configs.routes.logout) {
          this.token = ''
          removeToken()
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          removeToken()

          window.location.reload()
        }

        return Promise.reject(error)
      },
    )
  }
}

class CronjobHttp {
  private token: string
  instance: AxiosInstance

  constructor() {
    this.token = getToken()
    this.instance = axios.create({
      // baseURL: `${app_config.cronjob_api_url}`,
      baseURL: 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': app_config.cronjob_api_key,
      },
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config
        if (method === 'post' && url?.includes(configs.routes.login)) {
          const loginResponse = response.data as LoginResponse
          // Only set token if it's a valid login response with a non-empty token
          if (loginResponse && loginResponse.token && loginResponse.token.trim() !== '') {
            this.token = loginResponse.token
            setToken(this.token)
          }
        } else if (url === configs.routes.logout) {
          this.token = ''
          removeToken()
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          removeToken()

          window.location.reload()
        }

        return Promise.reject(error)
      },
    )
  }
}

const booking_http = new Http().instance
const cronjob_http = new CronjobHttp().instance

export default {
  booking_http,
  cronjob_http,
}
