import { renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import ProfileCardShareUniversalPage from '@/components/ProfileCardShareUniversalPage.vue'

const navigateToMock = vi.hoisted(() => vi.fn())
mockNuxtImport('navigateTo', () => {
  return navigateToMock
})

describe('ProfileCardShareUniversalPage', () => {
  const profile: Profile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
  }

  it('should render', async () => {
    const component = await renderSuspended(ProfileCardShareUniversalPage, {
      props: { profile },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should open in a new tab', async () => {
    const component = await renderSuspended(ProfileCardShareUniversalPage, {
      props: { profile },
    })

    ;(await component.findByRole('img')).click()

    expect(navigateToMock).toHaveBeenCalledWith(
      'https://universal.page/profiles/lukso/0x1234567890abcdef1234567890abcdef12345678',
      {
        external: true,
        open: {
          target: '_blank',
        },
      }
    )
  })
})
