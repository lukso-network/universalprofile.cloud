/**
 * Connected profile store
 *
 * Keeps the information about connected profile
 *
 */
export const useConnectedProfileStore = defineStore('connectedProfile', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({
    isConnected: false,
    isProfileLoading: false,
    isConnecting: false,
  })

  // --- actions

  const setStatus = (statusName: keyof typeof status, newStatus: boolean) => {
    status[statusName] = newStatus
  }

  return {
    ...useBaseProfile(profile),
    profile,
    status,
    setStatus,
  }
})
