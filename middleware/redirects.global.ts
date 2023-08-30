import { profileRoute } from '@/shared/routes'

let value =
  document.location.origin === 'https://wallet.universalprofile.cloud/' ||
  (/pages.dev|localhost/.test(document.location.origin) &&
    /[?&]wallet\b/.test(document.location.search))
if (
  document.location.origin === 'https://universalprofile.cloud/' ||
  (/pages.dev|localhost/.test(document.location.origin) &&
    /[?&]global\b/.test(document.location.search))
) {
  value = false
}
export const isWallet = useCookie('isWallet', { default: () => value })
watch(
  () => value,
  (value, oldValue) => {
    if (value === oldValue) {
      return
    }
    isWallet.value = value
  }
)

export default defineNuxtRouteMiddleware(to => {
  // we redirect / to empty profile page, this might change in the future with wallet landing page
  if (to.name && to.name === 'index' && isWallet.value) {
    return navigateTo(profileRoute('0x0'))
  }
})
