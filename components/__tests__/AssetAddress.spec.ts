import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AssetAddress from '@/components/AssetAddress.vue'

describe('AssetAddress', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render loading state', async () => {
    const component = await renderSuspended(AssetAddress)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render address', async () => {
    const component = await renderSuspended(AssetAddress, {
      props: {
        asset: {
          address: '0xd1d18961ffeba233ba023e25e602f842d4a3d668',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for no address', async () => {
    const component = await renderSuspended(AssetAddress, {
      props: {
        asset: {
          address: undefined,
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render without title', async () => {
    const component = await renderSuspended(AssetAddress, {
      props: {
        withoutTitle: true,
        asset: {
          address: '0xd1d18961ffeba233ba023e25e602f842d4a3d668',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render in mobile', async () => {
    vi.mock(
      '/node_modules/@nuxtjs/device/dist/runtime/composables/useDevice',
      () => ({
        useDevice: () => ({
          isMobile: vi.fn().mockReturnValue(true),
        }),
      })
    )
    const component = await renderSuspended(AssetAddress, {
      props: {
        asset: {
          address: '0xd1d18961ffeba233ba023e25e602f842d4a3d668',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
