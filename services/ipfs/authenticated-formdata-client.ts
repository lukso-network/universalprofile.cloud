import FormData from 'form-data'

import { CustomHeaderFormDataUploader } from './ipfs-formdata-clients'

import type { FormDataPostHeaders } from '@/services/ipfs/formdata-base-client'

export class AuthenticatedFormDataUploader extends CustomHeaderFormDataUploader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getHeaders(dataContent: FormData, meta?: FormDataPostHeaders) {
    const jwt = await this.getToken()
    return { Authorization: `Bearer ${jwt}` }
  }
  resolveUrl(result: any): string {
    return `ipfs://${result.IpfsHash}`
  }
  async getToken(): Promise<string> {
    const sign = await import('@tsndr/cloudflare-worker-jwt').then(
      m => m.sign || m.default?.sign
    )
    const { $config } = useNuxtApp()

    const now = Date.now()
    return await sign(
      { iss: 'extension', iat: now / 1000, exp: (now + 120_000) / 1000 },
      $config.public.API_SHARED_SECRET || ''
    )
  }
}
