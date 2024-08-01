import { renderSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ProfileCard from '../ProfileCard.vue'

const viewedProfileMock = vi.fn()
const connectedProfileMock = vi.fn()

vi.mock('/composables/useProfile', () => ({
  useProfile: () => ({
    viewedProfile: viewedProfileMock,
    connectedProfile: connectedProfileMock,
  }),
}))

describe('ProfileCard', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
    vi.clearAllMocks()
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
        isFollowing: false,
        followerCount: 10000,
        followingCount: 20000,
      } as Profile)
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
        isFollowing: false,
        followerCount: 10000,
        followingCount: 20000,
      })
    )
    connectedProfileMock.mockReturnValue(
      toRef({
        address: '0xcafebabe',
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

  it('should render unfollow button', async () => {
    viewedProfileMock.mockReturnValue(
      toRef({
        address: '0x1234567890abcdef1234567890abcdef12345678',
        isFollowing: true,
        followerCount: 10000,
        followingCount: 20000,
      })
    )
    connectedProfileMock.mockReturnValue(
      toRef({
        address: '0xcafebabe',
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
