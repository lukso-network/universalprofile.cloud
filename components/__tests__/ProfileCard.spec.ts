import { renderSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ProfileCard from '../ProfileCard.vue'

const viewedProfileMock = vi.fn()
const connectedProfileMock = vi.fn()
const followersDataMock = vi.fn()
const getProfileMock = vi.fn()
const profilesMock = vi.fn()

vi.mock('/composables/useProfile', () => ({
  useProfile: () => ({
    viewedProfile: viewedProfileMock,
    connectedProfile: connectedProfileMock,
    getProfile: getProfileMock,
  }),
}))

vi.mock('/composables/useFollowingSystem', () => ({
  useFollowingSystem: () => ({
    getFollowersData: followersDataMock,
  }),
}))

vi.mock('/composables/useProfiles', () => ({
  useProfiles: () => profilesMock,
}))

describe('ProfileCard', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
    viewedProfileMock.mockReturnValue(toRef({ address: '' }))
    connectedProfileMock.mockReturnValue(toRef({ address: '' }))
    followersDataMock.mockReturnValue(
      toRef({
        isFollowing: false,
        followingCount: 0,
        followingAddresses: [],
        followerCount: 0,
        followerAddresses: [],
        isLoading: false,
      })
    )
    getProfileMock.mockReturnValue(toRef({ address: '' }))
    profilesMock.mockReturnValue({
      profiles: [],
      isLoading: false,
    })
  })

  it('should render empty profile', async () => {
    const component = await renderSuspended(ProfileCard)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render profile when not connected', async () => {
    viewedProfileMock.mockReturnValue(
      toRef({
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'john',
        description: 'Lorem ipsum dolor sit amet',
        tags: ['tag1', 'tag2'],
        profileImage: [
          {
            url: 'https://example.com/profile.jpg',
          },
        ],
        backgroundImage: [
          {
            url: 'https://example.com/background.jpg',
          },
        ],
        links: [
          {
            url: 'https://example.com/link',
            title: 'Link',
          },
        ],
      } as Profile)
    )
    followersDataMock.mockReturnValue(
      toRef({ isFollowing: false, followerCount: 10000, followingCount: 20000 })
    )

    const component = await renderSuspended(ProfileCard)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render profile when connected', async () => {
    viewedProfileMock.mockReturnValue(
      toRef({
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'john',
        description: 'Lorem ipsum dolor sit amet',
        tags: ['tag1', 'tag2'],
        profileImage: [
          {
            url: 'https://example.com/profile.jpg',
          },
        ],
        backgroundImage: [
          {
            url: 'https://example.com/background.jpg',
          },
        ],
        links: [
          {
            url: 'https://example.com/link',
            title: 'Link',
          },
        ],
      })
    )
    connectedProfileMock.mockReturnValue(
      toRef({
        address: '0xcafebabe',
      })
    )
    followersDataMock.mockReturnValue(
      toRef({ isFollowing: false, followerCount: 10000, followingCount: 20000 })
    )

    const component = await renderSuspended(ProfileCard, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render unfollow button', async () => {
    viewedProfileMock.mockReturnValue(
      toRef({
        address: '0x1234567890abcdef1234567890abcdef12345678',
      })
    )
    connectedProfileMock.mockReturnValue(
      toRef({
        address: '0xcafebabe',
      })
    )
    followersDataMock.mockReturnValue(
      toRef({ isFollowing: true, followerCount: 10000, followingCount: 20000 })
    )

    const component = await renderSuspended(ProfileCard, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render followed by info', async () => {
    viewedProfileMock.mockReturnValue(
      toRef({
        address: '0x1234567890abcdef1234567890abcdef12345678',
      })
    )
    connectedProfileMock.mockReturnValue(
      toRef({
        address: '0xcafebabe',
      })
    )
    followersDataMock.mockReturnValue(
      toRef({
        isFollowing: true,
        followerCount: 10000,
        followingCount: 20000,
        followerAddresses: ['0x1'],
        followingAddresses: ['0x1'],
      } as ProfileFollowers)
    )
    getProfileMock.mockReturnValue(toRef({ address: '0x1' }))
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

    const component = await renderSuspended(ProfileCard, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
