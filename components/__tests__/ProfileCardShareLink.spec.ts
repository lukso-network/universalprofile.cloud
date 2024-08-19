import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ProfileCardShareLink from '@/components/ProfileCardShareLink.vue'

describe('ProfileCardShareLink', () => {
  const profile: Profile = {
    profileLink: {
      resolved:
        'https://universalswaps.io/social/0x1234567890abcdef1234567890abcdef12345678',
      link: 'https://universalswaps.io/social/{address}',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      checksummed: '0x1234567890abcdef1234567890abcdef12345678',
      isResolved: true,
    },
  }

  it('should render', async () => {
    const component = await renderSuspended(ProfileCardShareLink, {
      props: { profile },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
