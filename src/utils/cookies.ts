import configs from '@/configs'

export const getCookie = (name: string) => {
  return localStorage.getItem(name)
}

export const setCookie = (name: string, value: string) => {
  localStorage.setItem(name, value)
}

export const removeCookie = (name: string) => {
  localStorage.removeItem(name)
}

// Token
export const getToken = () => {
  return getCookie(configs.cookies.token) as string
}

export const setToken = (token: string) => {
  setCookie(configs.cookies.token, token)
}

export const removeToken = () => {
  removeCookie(configs.cookies.token)
}

// // Access token
// export const getAccessToken = () => {
//   return getCookie(configs.cookies.accessToken)
// }

// export const setAccessToken = (token: string) => {
//   setCookie(configs.cookies.accessToken, token)
// }

// export const removeAccessToken = () => {
//   removeCookie(configs.cookies.accessToken)
// }

// // Refresh token
// export const getRefreshToken = () => {
//   return getCookie(configs.cookies.refreshToken)
// }

// export const setRefreshToken = (token: string) => {
//   setCookie(configs.cookies.refreshToken, token)
// }

// export const removeRefreshToken = () => {
//   removeCookie(configs.cookies.refreshToken)
// }
