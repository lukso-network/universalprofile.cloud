import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import NftListCardCreatorsGraph from '../NftListCardCreatorsGraph.vue'

describe('NftListCardCreatorsGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('render loading state', async () => {
    const component = await renderSuspended(NftListCardCreatorsGraph)

    expect(component.html()).toMatchSnapshot()
  })

  it('render empty creators', async () => {
    const component = await renderSuspended(NftListCardCreatorsGraph, {
      props: {
        asset: {} as Asset,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('render more creators then limit', async () => {
    const component = await renderSuspended(NftListCardCreatorsGraph, {
      props: {
        asset: {
          tokenCreatorsData: [
            {
              address: '0x123',
              name: 'John Doe',
              profileImage: [
                {
                  url: 'https://example.com/profile1-image.jpg',
                },
              ],
            } as Creator,
            {
              address: '0x456',
              name: 'Alice Doe',
              profileImage: [
                {
                  url: 'https://example.com/profile2-image.jpg',
                },
              ],
            } as Creator,
            {
              address: '0x789',
              name: 'Bob Doe',
              profileImage: [
                {
                  url: 'https://example.com/profile3-image.jpg',
                },
              ],
            } as Creator,
            {
              address: '0xabc',
              name: 'Charlie Doe',
              profileImage: [
                {
                  url: 'https://example.com/profile4-image.jpg',
                },
              ],
            } as Creator,
            {
              address: '0xdef',
              name: 'David Doe',
              profileImage: [
                {
                  url: 'https://example.com/profile5-image.jpg',
                },
              ],
            } as Creator,
          ],
        } as Asset,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  describe('verification', () => {
    it('render all verified', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          asset: {
            address: '0xabc',
            tokenCreatorsData: [
              {
                address: '0x123',
                name: 'John Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile1-image.jpg',
                  },
                ],
                issuedAssets: ['0xabc'],
              } as Creator,
              {
                address: '0x456',
                name: 'Alice Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile2-image.jpg',
                  },
                ],
                issuedAssets: ['0xabc'],
              } as Creator,
            ],
          } as Asset,
          hasVerification: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render some verified', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          asset: {
            address: '0xabc',
            tokenCreatorsData: [
              {
                address: '0x123',
                name: 'John Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile1-image.jpg',
                  },
                ],
                issuedAssets: ['0xabc'],
              } as Creator,
              {
                address: '0x456',
                name: 'Alice Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile2-image.jpg',
                  },
                ],
                issuedAssets: ['0xcaf'],
              } as Creator,
            ],
          } as Asset,
          hasVerification: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render none verified', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          asset: {
            address: '0xabc',
            tokenCreatorsData: [
              {
                address: '0x123',
                name: 'John Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile1-image.jpg',
                  },
                ],
                issuedAssets: ['0xcaf'],
              } as Creator,
              {
                address: '0x456',
                name: 'Alice Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile2-image.jpg',
                  },
                ],
                issuedAssets: ['0xcaf'],
              } as Creator,
            ],
          } as Asset,
          hasVerification: true,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render without verification', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          asset: {
            tokenCreatorsData: [
              {
                address: '0x123',
                name: 'John Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile1-image.jpg',
                  },
                ],
              } as Creator,
            ],
          } as Asset,
          hasVerification: false,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })
  })

  describe('large size', () => {
    it('render loading state', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          isSmall: false,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('render creators', async () => {
      const component = await renderSuspended(NftListCardCreatorsGraph, {
        props: {
          asset: {
            address: '0xabc',
            tokenCreatorsData: [
              {
                address: '0x123',
                name: 'John Doe',
                profileImage: [
                  {
                    url: 'https://example.com/profile1-image.jpg',
                  },
                ],
                issuedAssets: ['0xabc'],
              } as Creator,
            ],
          } as Asset,
          isSmall: false,
        },
      })

      expect(component.html()).toMatchSnapshot()
    })
  })
})
