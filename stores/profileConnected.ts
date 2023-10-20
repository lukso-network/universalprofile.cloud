import { Profile } from '@/types/profile'

/**
 * Connected profile store
 *
 * Keeps the information about connected profile
 *
 */
export const useConnectedProfileStore = defineStore('profileConnected', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({
    isConnected: false,
    isProfileLoading: false,
    isProfileLoaded: false,
    isConnecting: false,
  })

  // --- actions

  const setStatus = (statusName: keyof typeof status, newStatus: boolean) => {
    status[statusName] = newStatus
  }

  return {
    ...useProfileBase(profile),
    profile,
    status,
    setStatus,
  }
})
