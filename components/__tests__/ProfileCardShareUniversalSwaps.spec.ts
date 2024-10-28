import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import ProfileCardShareUniversalSwaps from '@/components/ProfileCardShareUniversalSwaps.vue'

const navigateToMock = vi.hoisted(() => vi.fn())
mockNuxtImport('navigateTo', () => {
  return navigateToMock
})

describe('ProfileCardShareUniversalSwaps', () => {
  const profile: Profile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
  }

  it('should render', async () => {
    const component = await renderSuspended(ProfileCardShareUniversalSwaps, {
      props: { profile },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should open in a new tab', async () => {
    const component = await renderSuspended(ProfileCardShareUniversalSwaps, {
      props: { profile },
    })

    ;(await component.findByRole('img')).click()

    expect(navigateToMock).toHaveBeenCalledWith(
      'https://universalswaps.io/social/0x1234567890abcdef1234567890abcdef12345678',
      {
        external: true,
        open: {
          target: '_blank',
        },
      }
    )
  })
})
