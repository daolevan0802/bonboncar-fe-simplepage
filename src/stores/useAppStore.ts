import { create } from 'zustand'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface AppState {
  sidebarOpen: boolean
  notifications: Array<Notification>
  isLoading: boolean
  currentPage: string
}

interface AppActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  notifications: [],
  isLoading: false,
  currentPage: '',

  // Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open })
  },

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page })
  },
}))
