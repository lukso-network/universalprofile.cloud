import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import FollowedBy from '../FollowedBy.vue'

const profilesMock = vi.fn()

vi.mock('/composables/useProfiles', () => ({
  useProfiles: () => profilesMock,
}))

describe('FollowedBy', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
    profilesMock.mockReturnValue({
      profiles: [],
      isLoading: false,
    })
  })

  it('should render empty state', async () => {
    const component = await renderSuspended(FollowedBy)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for 1 follower', async () => {
    profilesMock.mockReturnValue(
      toRef({
        profiles: [
          {
            address: '0x1',
            name: 'john',
          },
        ],
        isLoading: false,
      })
    )
    const component = await renderSuspended(FollowedBy, {
      props: {
        followerAddresses: ['0x1'],
        followingAddresses: ['0x1'],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for 2 followers', async () => {
    profilesMock.mockReturnValue(
      toRef({
        profiles: [
          {
            address: '0x1',
            name: 'john',
          },
          {
            address: '0x2',
            name: 'jane',
          },
        ],
        isLoading: false,
      })
    )
    const component = await renderSuspended(FollowedBy, {
      props: {
        followerAddresses: ['0x1', '0x2'],
        followingAddresses: ['0x1', '0x2'],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for 3 followers', async () => {
    profilesMock.mockReturnValue(
      toRef({
        profiles: [
          {
            address: '0x1',
            name: 'john',
          },
          {
            address: '0x2',
          },
        ],
        isLoading: false,
      })
    )
    const component = await renderSuspended(FollowedBy, {
      props: {
        followerAddresses: ['0x1', '0x2', '0x3'],
        followingAddresses: ['0x1', '0x2', '0x3'],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for 4 followers', async () => {
    profilesMock.mockReturnValue(
      toRef({
        profiles: [
          {
            address: '0x1',
            name: 'john',
          },
          {
            address: '0x2',
            name: 'jane',
          },
        ],
        isLoading: false,
      })
    )
    const component = await renderSuspended(FollowedBy, {
      props: {
        followerAddresses: ['0x1', '0x2', '0x3', '0x4'],
        followingAddresses: ['0x1', '0x2', '0x3', '0x4'],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for 5 followers', async () => {
    profilesMock.mockReturnValue(
      toRef({
        profiles: [
          {
            address: '0x1',
            name: 'john',
          },
          {
            address: '0x2',
            name: 'jane',
          },
        ],
        isLoading: false,
      })
    )
    const component = await renderSuspended(FollowedBy, {
      props: {
        followerAddresses: ['0x1', '0x2', '0x3', '0x4', '0x5'],
        followingAddresses: ['0x1', '0x2', '0x3', '0x4', '0x5'],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
