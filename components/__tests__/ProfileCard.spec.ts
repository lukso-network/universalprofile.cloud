import { renderSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ProfileCard from '../ProfileCard.vue'

describe('ProfileCard', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render empty profile', async () => {
    const component = await renderSuspended(ProfileCard)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render profile', async () => {
    vi.mock('/composables/useProfile', () => ({
      useProfile: () => ({
        viewedProfile: vi.fn().mockReturnValue(
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
        ),
        connectedProfile: vi.fn(),
      }),
    }))

    const component = await renderSuspended(ProfileCard)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render follow button', async () => {
    vi.mock('/composables/useProfile', () => ({
      useProfile: () => ({
        viewedProfile: vi.fn().mockReturnValue(
          toRef({
            address: '0x1234567890abcdef1234567890abcdef12345678',
            isFollowing: false,
          })
        ),
        connectedProfile: vi.fn().mockReturnValue(
          toRef({
            address: '0xcafebabe',
          })
        ),
      }),
    }))

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