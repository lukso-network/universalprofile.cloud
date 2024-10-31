import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import FollowCounters from '../FollowCounters.vue'

import type { ProfileFollowers } from '@/types/profile'

describe('FollowCounters', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render empty state', async () => {
    const component = await renderSuspended(FollowCounters)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render counters', async () => {
    const component = await renderSuspended(FollowCounters, {
      props: {
        profileFollowers: {
          followerCount: 1000,
          followingCount: 2000,
        } as ProfileFollowers,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
