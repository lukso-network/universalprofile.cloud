// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'

import ProfileCardShare from '@/components/ProfileCardShare.vue'

describe('ProfileCardShare', () => {
  const profile: Profile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
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
    const component = await renderSuspended(ProfileCardShare, {
      props: { profile },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
