import { routes } from '@/shared/routes'

export default defineNuxtRouteMiddleware(to => {
  // we redirect /[address] to /[address]/profile page
  if (to.name && to.name === 'address') {
    const profileAddress = to.params.address
    return navigateTo(`/${profileAddress}${routes.profile}`)
  }

  // we redirect / to empty profile page, this might change in the future
  if (to.name && to.name === 'index') {
    return navigateTo(`/0x0${routes.profile}`)
  }
})
