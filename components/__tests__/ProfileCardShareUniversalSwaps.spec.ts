import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import ProfileCardShareUniversalSwaps from '@/components/ProfileCardShareUniversalSwaps.vue'

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

    const windowOpenSpy = vi.spyOn(window, 'open')

    ;(await component.findByRole('img')).click()

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://universalswaps.io/social/0x1234567890abcdef1234567890abcdef12345678',
      '_blank'
    )
  })
})
