import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'
import LSP3Schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import LSP8Schema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import { RateLimiter } from 'limiter'
import ERC725, { type ERC725JSONSchema } from '@erc725/erc725.js'
import { type AbiItem } from 'web3-utils'
import ABICoder from 'web3-eth-abi'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import { INTERFACE_IDS as INTERFACE_IDS_v12 } from '@lukso/lsp-smart-contracts-12'
import { type QueryKey } from '@tanstack/vue-query'

import LSP2FetcherWithMulticall3Contract from './LSP2FetcherWithMulticall3.json'

import type { LSP2FetcherWithMulticall3 } from '@/types/contracts/utils'
import type { LSP8IdentifiableDigitalAsset } from '@/types/contracts/LSP8IdentifiableDigitalAsset'
import type { LSP7DigitalAsset } from '@/types/contracts/LSP7DigitalAsset'

export type QueryPromiseCallOptions = {
  type: 'call'
  address: Address
  method: string
  args: unknown[]
}
export type QueryPromiseDataOptions = {
  type: 'data'
  address: Address
  keyName: string
  dynamicKeyParts?: string | string[]
  schema?: ERC725JSONSchema[]
}
export type QueryPromiseOptions =
  | QueryPromiseCallOptions
  | QueryPromiseDataOptions

type DeferCapture<T = unknown, E = unknown> = {
  resolve: (result: T) => void
  reject: (error: E) => void
  promise: Promise<T>
  [key: string]: unknown
}

export type QueryPromise<
  T = unknown,
  O = QueryPromiseOptions,
> = DeferCapture<T> &
  O & { resolve: (result: unknown) => void; reject: (error: unknown) => void }

function capture(): DeferCapture {
  const output: DeferCapture = {
    resolve: () => {},
    reject: () => {},
  } as unknown as DeferCapture
  output.promise = new Promise((resolve, reject) => {
    output.resolve = resolve
    output.reject = reject
  })
  return output
}

export function createQueryPromise<T = unknown, O = QueryPromiseOptions>(
  options: O
): DeferCapture<T> & O {
  const output = capture()
  Object.assign(output, options)
  return output as unknown as DeferCapture<T> & O
}

let queryTimer: NodeJS.Timeout | undefined
const callQueryList: Array<QueryPromise<unknown, QueryPromiseCallOptions>> = []
const dataQueryList: Array<QueryPromise<unknown, QueryPromiseDataOptions>> = []
const defaultSchema = LSP4Schema.concat(LSP3Schema, LSP8Schema)
const LSP2ContractAddress = '0x76b872b9936efdd315ba3b78f730d9236de7f5ce'

// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
const limiter = new RateLimiter({ tokensPerInterval: 80, interval: 'second' })

function convert<T = any>(
  query: QueryPromise<unknown, QueryPromiseDataOptions>,
  data: string,
  overrideSchema?: ERC725JSONSchema[]
): T {
  const { keyName, schema, dynamicKeyParts } = query
  const info = ERC725.decodeData(
    [{ keyName, value: data, dynamicKeyParts }],
    overrideSchema || schema || defaultSchema
  ) as Array<{ name: string; value: unknown }>
  return info.find(({ name }) => name == keyName)?.value as T
}

async function doQueries() {
  const calls = callQueryList.splice(0, callQueryList.length)
  const datas = dataQueryList.splice(0, dataQueryList.length)
  console.log('doQueries', calls.length, datas.length)
  const callsSplit = calls.reduce(
    (acc, query) => {
      if (!acc[query.address]) {
        acc[query.address] = { calls: [], datas: [] }
      }
      acc[query.address].calls.push(query)
      return acc
    },
    {} as Record<
      string,
      {
        calls: QueryPromise<unknown, QueryPromiseCallOptions>[]
        datas: QueryPromise<unknown, QueryPromiseDataOptions>[]
      }
    >
  )

  const split = datas.reduce((acc, query) => {
    if (!acc[query.address]) {
      acc[query.address] = { calls: [], datas: [] }
    }
    acc[query.address].datas.push(query)
    return acc
  }, callsSplit)

  const multicall: {
    index: number
    target: string
    call: string
    query?: QueryPromise<any>
    queries?: Array<QueryPromise<any>>
  }[] = []

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp2CustomContract = contract<LSP2FetcherWithMulticall3>(
    LSP2FetcherWithMulticall3Contract.abi as AbiItem[],
    LSP2ContractAddress
  )

  try {
    for (const [address, { datas, calls }] of Object.entries(split)) {
      const lspContract = contract<
        LSP8IdentifiableDigitalAsset | LSP7DigitalAsset
      >(
        LSP8IdentifiableDigitalAssetContract.abi.concat(
          LSP7DigitalAssetContract.abi
        ) as AbiItem[],
        address
      )

      const plainKeys = datas.filter(({ keyName }) => !/\[\]$/.test(keyName))
      if (plainKeys.length > 0) {
        multicall.push({
          index: multicall.length,
          target: address,
          call: (lspContract.methods as any)
            .getDataBatch(
              plainKeys.map(({ keyName, dynamicKeyParts }) =>
                ERC725.encodeKeyName(keyName, dynamicKeyParts)
              )
            )
            .encodeABI(),
          queries: plainKeys,
        })
      }
      const arrayKeys = datas.filter(({ keyName }) => /\[\]$/.test(keyName))
      if (arrayKeys.length > 0) {
        for (const query of arrayKeys) {
          const { keyName, dynamicKeyParts } = query
          multicall.push({
            index: multicall.length,
            target: '0x0000000000000000000000000000000000000000',
            call: lsp2CustomContract.methods
              .fetchArrayWithElements(
                address,
                ERC725.encodeKeyName(keyName, dynamicKeyParts)
              )
              .encodeABI(),
            query,
          })
        }
      }
      for (const query of calls) {
        if (address === LSP2ContractAddress) {
          multicall.push({
            index: multicall.length,
            target: '0x0000000000000000000000000000000000000000',
            call: (lsp2CustomContract.methods as any)
              [query.method](...query.args)
              .encodeABI() as string,
            query,
          })
        } else {
          multicall.push({
            index: multicall.length,
            target: address,
            call: (lspContract.methods as any)
              [query.method](...query.args)
              .encodeABI(),
            query,
          })
        }
      }
    }
    await limiter.removeTokens(1)
    console.log('multicall', multicall.length)
    await lsp2CustomContract.methods
      .aggregate3(multicall.map(({ target, call }) => [target, true, call]))
      .call()
      .then((result: [boolean, string][]) => {
        for (const [i, { query, queries }] of multicall.entries()) {
          const [success, data] = result[i]
          if (queries) {
            const items = ABICoder.decodeParameters(
              ['bytes[]'],
              data
            )[0] as string[]
            for (const [j, query] of queries.entries()) {
              try {
                let item = items[j]
                if (query.type === 'data') {
                  item = convert(
                    query as QueryPromise<unknown, QueryPromiseDataOptions>,
                    item
                  )
                }
                if (success) {
                  query.resolve(item)
                } else {
                  query.reject(new Error('Call failed'))
                }
              } catch (error) {
                try {
                  query.reject(error)
                } catch {
                  // Really ignore, we tried our best
                }
              }
            }
            continue
          }
          try {
            if (success) {
              let item: string = data
              if (query?.type === 'data') {
                let schema = (query.schema || defaultSchema).find(
                  ({ name }) => name === query.keyName
                )
                if (schema && schema.keyType === 'Array') {
                  const array = ABICoder.decodeParameters(
                    ['bytes[]'],
                    item
                  )[0] as string[]
                  schema = { ...schema, keyType: 'Singleton' }
                  query?.resolve(
                    array.map(value =>
                      convert(
                        query as QueryPromise<unknown, QueryPromiseDataOptions>,
                        value,
                        schema ? [schema] : undefined
                      )
                    )
                  )
                  continue
                } else {
                  item = convert(
                    query as QueryPromise<unknown, QueryPromiseDataOptions>,
                    item
                  )
                }
              }
              query?.resolve(item)
            } else {
              query?.reject(new Error('Call failed'))
            }
          } catch (error) {
            try {
              query?.reject(error)
            } catch {
              // Really ignore, we tried our best
            }
          }
        }
      })
  } catch (error) {
    console.error(error)
    for (const query of (calls as QueryPromise<unknown, unknown>[]).concat(
      datas as QueryPromise<unknown, unknown>[]
    )) {
      query.reject(error)
    }
  }
}

export const interfacesToCheck = [
  INTERFACE_IDS.LSP0ERC725Account,
  INTERFACE_IDS.LSP7DigitalAsset,
  INTERFACE_IDS_v12.LSP7DigitalAsset,
  INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
  INTERFACE_IDS_v12.LSP8IdentifiableDigitalAsset,
]

export function defaultQueryFn<T = any>({ queryKey }: { queryKey: QueryKey }) {
  if (queryTimer) {
    clearTimeout(queryTimer)
  }
  console.log('query requested')
  if (queryKey[0] === 'call') {
    const [address, method, ...args] = queryKey.slice(1)
    const query = createQueryPromise<T, QueryPromiseCallOptions>({
      type: 'call',
      address: address as `0x${string}`,
      method: method as string,
      args,
    })
    callQueryList.push(query as QueryPromise<unknown, QueryPromiseCallOptions>)
    return query.promise
  }
  const [address, key, schema, dynamicKeyParts] = queryKey.slice(1)
  const query = createQueryPromise<T, QueryPromiseDataOptions>({
    type: 'data',
    address: address as `0x${string}`,
    keyName: key as string,
    schema: schema as ERC725JSONSchema[] | undefined,
    dynamicKeyParts: dynamicKeyParts as string | string[] | undefined,
  })
  dataQueryList.push(query as QueryPromise<unknown, QueryPromiseDataOptions>)
  queryTimer = setTimeout(() => {
    queryTimer = undefined
    doQueries()
  }, 250)
  return query.promise
}
