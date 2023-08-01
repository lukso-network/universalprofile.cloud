import { profileRoute } from '@/shared/routes'

export default defineNuxtRouteMiddleware(to => {
  // we redirect / to empty profile page, this might change in the future with wallet landing page
  if (to.name && to.name === 'index') {
    return navigateTo(profileRoute('0x0'))
  }
})
