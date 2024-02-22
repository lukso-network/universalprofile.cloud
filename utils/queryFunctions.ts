import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP4DigitalAssetMetadataContract from '@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json'
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

export type QueryPromiseCallOptions = {
  type: 'call'
  chainId: string
  address: Address
  method: string
  args: unknown[]
}
export type QueryPromiseDataOptions = {
  type: 'data'
  chainId: string
  address: Address
  keyName: string
  dynamicKeyParts?: string | string[]
  schema?: ERC725JSONSchema[]
}
export type QueryPromiseTokenDataOptions = {
  type: 'tokenData'
  chainId: string
  address: Address
  keyName: string
  tokenId: `0x${string}`
  dynamicKeyParts?: string | string[]
  schema?: ERC725JSONSchema[]
}
export type QueryPromiseOptions =
  | QueryPromiseCallOptions
  | QueryPromiseDataOptions

type DeferCapture<T = unknown, E = unknown> = {
  resolve(result: T): void
  reject(error: E): void
  promise: Promise<T>
  [key: string]: unknown
}

export type QueryPromise<
  T = unknown,
  O = QueryPromiseOptions,
> = DeferCapture<T> & O

function capture(): DeferCapture {
  const output: DeferCapture = {
    resolve: () => {},
    reject: () => {},
  } as unknown as DeferCapture
  output.promise = new Promise((resolve, reject) => {
    output.resolve = value => {
      resolve(value)
    }
    output.reject = error => {
      reject(error)
    }
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
const queryList: Array<
  QueryPromise<
    unknown,
    | QueryPromiseCallOptions
    | QueryPromiseDataOptions
    | QueryPromiseTokenDataOptions
  >
> = []
export const defaultSchema = LSP4Schema.concat(LSP3Schema, LSP8Schema)
export const defaultAbi = (
  LSP8IdentifiableDigitalAssetContract.abi as AbiItem[]
).concat(
  LSP7DigitalAssetContract.abi as AbiItem[],
  LSP4DigitalAssetMetadataContract.abi as AbiItem[],
  eip165ABI as AbiItem[]
) as AbiItem[]

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
  const { currentNetwork } = storeToRefs(useAppStore())
  const { customLSP2ContractAddress: LSP2ContractAddress, chainId } =
    currentNetwork.value
  const allQueries = queryList.splice(0, queryList.length)
  allQueries
    .filter(query => query.chainId !== chainId)
    .forEach(query => query.reject(new Error('Query cancelled')))
  const queries = allQueries.filter(query => query.chainId === chainId)
  const split: Record<
    string,
    {
      call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
      data?: QueryPromise<unknown, QueryPromiseDataOptions>[]
      tokenData?: QueryPromise<unknown, QueryPromiseTokenDataOptions>[]
    }
  > = queries.reduce(
    (acc, query) => {
      if (!acc[query.address]) {
        acc[query.address] = {}
      }
      let items = acc[query.address][query.type] as QueryPromise<
        unknown,
        | QueryPromiseCallOptions
        | QueryPromiseDataOptions
        | QueryPromiseTokenDataOptions
      >[]
      if (!items) {
        items = acc[query.address][query.type] = []
      }
      items.push(query)
      return acc
    },
    {} as Record<
      string,
      {
        call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
        data?: QueryPromise<unknown, QueryPromiseDataOptions>[]
        tokenData?: QueryPromise<unknown, QueryPromiseTokenDataOptions>[]
      }
    >
  )

  const multicall: {
    index: number
    target: string
    call: string
    query?: QueryPromise<any>
    queries?: Array<QueryPromise<any>>
    selector?: (data: any) => any
  }[] = []

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp2CustomContract = contract<LSP2FetcherWithMulticall3>(
    LSP2FetcherWithMulticall3Contract.abi as AbiItem[],
    LSP2ContractAddress
  )

  try {
    for (const [address, { data, tokenData, call }] of Object.entries(split)) {
      if (tokenData) {
        const tokenIds = tokenData.reduce(
          (
            tokenIds: Record<
              string,
              QueryPromise<unknown, QueryPromiseTokenDataOptions>[]
            >,
            query
          ) => {
            const { address } = query
            if (!tokenIds[address]) {
              tokenIds[address] = []
            }
            tokenIds[address].push(query)
            return tokenIds
          },
          {} as Record<
            string,
            QueryPromise<unknown, QueryPromiseTokenDataOptions>[]
          >
        )
        for (const tokenQueries of Object.values(tokenIds)) {
          const { address } = tokenQueries[0]
          const abi = LSP8IdentifiableDigitalAssetContract.abi.find(
            ({ name }) => name === 'getDataBatchForTokenIds'
          )
          const call = ABICoder.encodeFunctionCall(abi as AbiItem, [
            tokenQueries.map(({ tokenId }) => tokenId) as unknown as string,
            tokenQueries.map(({ keyName, dynamicKeyParts }) =>
              ERC725.encodeKeyName(keyName, dynamicKeyParts)
            ) as unknown as string,
          ])
          multicall.push({
            index: multicall.length,
            target: address,
            call,
            queries: tokenQueries as unknown as QueryPromise<any>[],
            selector: (data: string) => {
              if (data === '0x') {
                return null
              }
              return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
            },
          })
        }
      }

      if (data) {
        const plainKeys = data.filter(({ keyName }) => !/\[\]$/.test(keyName))
        if (plainKeys.length > 0) {
          const abi = LSP8IdentifiableDigitalAssetContract.abi.find(
            ({ name }) => name === 'getDataBatch'
          )
          const call = ABICoder.encodeFunctionCall(
            abi as AbiItem,
            [
              plainKeys.map(({ keyName, dynamicKeyParts }) =>
                ERC725.encodeKeyName(keyName, dynamicKeyParts)
              ),
            ] as unknown as string[]
          )
          multicall.push({
            index: multicall.length,
            target: address,
            call,
            queries: plainKeys,
            selector: (data: string) => {
              if (data === '0x') {
                return null
              }
              return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
            },
          })
        }
        const arrayKeys = data.filter(({ keyName }) => /\[\]$/.test(keyName))
        if (arrayKeys.length > 0) {
          for (const query of arrayKeys) {
            const { keyName, dynamicKeyParts } = query
            const abi = LSP2FetcherWithMulticall3Contract.abi.find(
              ({ name }) => name === 'fetchArrayWithElements'
            )
            const call = ABICoder.encodeFunctionCall(abi as AbiItem, [
              address,
              ERC725.encodeKeyName(keyName, dynamicKeyParts),
            ])
            multicall.push({
              index: multicall.length,
              target: '0x0000000000000000000000000000000000000000',
              call,
              query,
              selector: (data: string) => {
                return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
              },
            })
          }
        }
      }
      if (call) {
        for (const query of call) {
          if (address === LSP2ContractAddress) {
            const abi = (
              LSP2FetcherWithMulticall3Contract.abi as AbiItem[]
            ).find(({ name }) => name === 'fetchArrayWithElements')
            if (abi) {
              const call = ABICoder.encodeFunctionCall(
                abi as AbiItem,
                query.args as string[]
              )
              multicall.push({
                index: multicall.length,
                target: '0x0000000000000000000000000000000000000000',
                call,
                query,
                selector: (data: string) => {
                  return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
                },
              })
            } else {
              query.reject(new Error('Method not found'))
            }
          } else {
            const abi = defaultAbi.find(({ name, inputs }) => {
              return (
                name === query.method.replace(/\(.*$/, '') &&
                `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                  query.method
              )
            })
            if (abi) {
              const call = ABICoder.encodeFunctionCall(
                abi as AbiItem,
                query.args as string[]
              )
              multicall.push({
                index: multicall.length,
                target: address,
                call,
                query,
                selector: (data: string) => {
                  return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
                },
              })
            } else {
              query.reject(new Error('Method not found'))
            }
          }
        }
      }
    }
    await limiter.removeTokens(1)
    await lsp2CustomContract.methods
      .aggregate3(multicall.map(({ target, call }) => [target, true, call]))
      .call()
      .then((result: [boolean, string][]) => {
        for (const [i, { query, queries, selector }] of multicall.entries()) {
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
                } else if (selector) {
                  item = selector(item)
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
              } else if (selector) {
                item = selector(item)
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
    for (const query of queries) {
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
  queryTimer = setTimeout(() => {
    queryTimer = undefined
    doQueries()
  }, 250)
  if (queryKey[0] === 'call') {
    const [chainId, address, method, ...args] = queryKey.slice(1)
    const query = createQueryPromise<T, QueryPromiseCallOptions>({
      type: 'call',
      chainId: chainId as string,
      address: address as `0x${string}`,
      method: method as string,
      args,
    })
    queryList.push(query as QueryPromise<unknown, QueryPromiseCallOptions>)
    return query.promise
  }
  if (queryKey[0] === 'tokenData') {
    const [chainId, address, tokenId, key, schema, dynamicKeyParts] =
      queryKey.slice(1)
    const query = createQueryPromise<T, QueryPromiseTokenDataOptions>({
      type: 'tokenData',
      chainId: chainId as string,
      address: address as `0x${string}`,
      keyName: key as string,
      tokenId: tokenId as `0x${string}`,
      schema: schema as ERC725JSONSchema[] | undefined,
      dynamicKeyParts: dynamicKeyParts as string | string[] | undefined,
    })
    queryList.push(query as QueryPromise<unknown, QueryPromiseTokenDataOptions>)
    return query.promise
  }
  const [chainId, address, key, schema, dynamicKeyParts] = queryKey.slice(1)
  const query = createQueryPromise<T, QueryPromiseDataOptions>({
    type: 'data',
    chainId: chainId as string,
    address: address as `0x${string}`,
    keyName: key as string,
    schema: schema as ERC725JSONSchema[] | undefined,
    dynamicKeyParts: dynamicKeyParts as string | string[] | undefined,
  })
  queryList.push(query as QueryPromise<unknown, QueryPromiseDataOptions>)
  return query.promise
}
