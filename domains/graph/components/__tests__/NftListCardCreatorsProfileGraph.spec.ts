import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import NftListCardCreatorsProfileGraph from '../NftListCardCreatorsProfileGraph.vue'

describe('NftListCardCreatorsProfileGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('render loading state', async () => {
    const component = await renderSuspended(NftListCardCreatorsProfileGraph)

    expect(component.html()).toMatchSnapshot()
  })

  it('render empty creator', async () => {
    const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
      props: {
        creator: {} as Creator,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('render creator', async () => {
    const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
      props: {
        creator: {
          address: '0x123',
          name: 'John Doe',
          profileImage: [
            {
              url: 'https://example.com/profile-image.jpg',
            },
          ],
        } as Creator,
        hasName: true,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('render count', async () => {
    const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
      props: {
        creator: {
          address: '0x123',
          name: 'John Doe',
          profileImage: [
            {
              url: 'https://example.com/profile-image.jpg',
            },
          ],
        } as Creator,
        count: 1,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  describe('when small size', () => {
    it('render loading state', async () => {
      const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
        props: {
          isSmall: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render creator', async () => {
      const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
        props: {
          creator: {
            address: '0x123',
            name: 'John Doe',
            profileImage: [
              {
                url: 'https://example.com/profile-image.jpg',
              },
            ],
          } as Creator,
          hasName: true,
          isSmall: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render count', async () => {
      const component = await renderSuspended(NftListCardCreatorsProfileGraph, {
        props: {
          creator: {
            address: '0x123',
            name: 'John Doe',
            profileImage: [
              {
                url: 'https://example.com/profile-image.jpg',
              },
            ],
          } as Creator,
          count: 1,
          isSmall: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })
  })
})
