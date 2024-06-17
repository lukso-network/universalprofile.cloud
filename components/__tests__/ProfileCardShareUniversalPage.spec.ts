import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import ProfileCardShareUniversalPage from '@/components/ProfileCardShareUniversalPage.vue'

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

    const windowOpenSpy = vi.spyOn(window, 'open')

    ;(await component.findByRole('img')).click()

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://universal.page/profiles/lukso/0x1234567890abcdef1234567890abcdef12345678',
      '_blank'
    )
  })
})
