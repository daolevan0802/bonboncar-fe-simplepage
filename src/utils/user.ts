import configs from '@/configs'

export const getUser = (name: string) => {
  return localStorage.getItem(name)
}

export const setUser = (name: string, value: string) => {
  localStorage.setItem(name, value)
}

export const removeUser = (name: string) => {
  localStorage.removeItem(name)
}

// Token
export const getUserEmail = () => {
  return getUser(configs.user.email) as string
}

export const setUserEmail = (email: string) => {
  setUser(configs.user.email, email)
}

export const removeUserEmail = () => {
  removeUser(configs.user.email)
}
