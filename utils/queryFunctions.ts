import { Buffer } from 'buffer'
import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP4DigitalAssetMetadataContract from '@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json'
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'
import LSP3Schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import LSP8Schema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import { RateLimiter } from 'limiter'
import {
  type ERC725JSONSchema,
  decodeData,
  getDataFromExternalSources,
  encodeKeyName,
} from '@erc725/erc725.js'
import { type AbiItem } from 'web3-utils'
import ABICoder from 'web3-eth-abi'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import { INTERFACE_IDS as INTERFACE_IDS_v12 } from '@lukso/lsp-smart-contracts-12'
import { type QueryKey } from '@tanstack/vue-query'

import LSP2FetcherWithMulticall3Contract from './LSP2FetcherWithMulticall3.json'

const QUERY_TIMEOUT = 250
const BIG_QUERY_LIMIT = 0
const MAX_AGGREGATE_COUNT = 50

export type QueryPromiseCallOptions = {
  type: 'call'
  isBig: boolean
  chainId: string
  address: Address
  method: string
  args: unknown[]
}
export type QueryPromiseDataOptions = {
  type: 'data'
  isBig: boolean
  chainId: string
  address: Address
  keyName: string
  dynamicKeyParts?: string | string[]
  schema?: ERC725JSONSchema[]
}
export type QueryPromiseTokenDataOptions = {
  type: 'tokenData'
  isBig: boolean
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

async function convert<T = any>(
  query: QueryPromise<unknown, QueryPromiseDataOptions>,
  data: string | null,
  overrideSchema?: ERC725JSONSchema[]
): Promise<T | null> {
  if (data == undefined) {
    return null
  }
  const { keyName, schema, dynamicKeyParts } = query
  let info = decodeData(
    [
      {
        keyName,
        value: data,
        dynamicKeyParts,
      },
    ],
    overrideSchema || schema || defaultSchema
  )
  const value = info.find(({ name }) => name == keyName)?.value
  if (value == undefined) {
    return null
  }
  try {
    info = await getDataFromExternalSources(
      overrideSchema || defaultSchema,
      info,
      'https://api.universalprofile.cloud/ipfs/',
      true
    )
  } catch {
    if (typeof info[0]?.value === 'object' && (info[0]?.value as any)?.url) {
      const [, encoding, data] =
        (info[0]?.value as any)?.url.match(/^data:.*?;(.*?),(.*)$/) || []
      if (data) {
        let output = Buffer.from(
          data,
          encoding === 'base64' ? 'base64' : 'utf8'
        ) as any
        try {
          output = JSON.parse(output.toString('utf8'))
        } catch {
          // ignore
        }
        return output as T
      }
    }
  }
  return info[0]?.value as T
}

async function doQueries() {
  const { currentNetwork } = storeToRefs(useAppStore())
  const { customLSP2ContractAddress: LSP2ContractAddress, chainId } =
    currentNetwork.value
  const { allQueries } = queryList
    .splice(0, Math.min(queryList.length, MAX_AGGREGATE_COUNT))
    .reduce(
      ({ allQueries, bigCount }, query) => {
        if (query.isBig) {
          if (bigCount > 0) {
            bigCount--
            allQueries.push(query)
          } else if (allQueries.length === 0) {
            allQueries.push(query)
          } else {
            if (queryTimer) {
              clearTimeout(queryTimer)
            }
            queryTimer = setTimeout(() => {
              queryTimer = undefined
              doQueries()
            }, QUERY_TIMEOUT)
            queryList.push(query)
          }
        } else {
          allQueries.push(query)
        }
        return { bigCount, allQueries }
      },
      {
        bigCount: BIG_QUERY_LIMIT,
        allQueries: [] as QueryPromise<
          unknown,
          | QueryPromiseDataOptions
          | QueryPromiseCallOptions
          | QueryPromiseTokenDataOptions
        >[],
      }
    )
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
  const lsp2CustomContract = contract<any>(
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
          if (abi) {
            const call = ABICoder.encodeFunctionCall(abi as AbiItem, [
              tokenQueries.map(({ tokenId }) => tokenId) as unknown as string,
              tokenQueries.map(({ keyName, dynamicKeyParts }) =>
                encodeKeyName(keyName, dynamicKeyParts)
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
                try {
                  return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
                } catch (error) {
                  console.error('decodeParameters', error)
                  return null
                }
              },
            })
          }
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
                encodeKeyName(keyName, dynamicKeyParts)
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
              encodeKeyName(keyName, dynamicKeyParts),
            ])
            multicall.push({
              index: multicall.length,
              target: '0x0000000000000000000000000000000000000000',
              call,
              query,
              selector: (data: string) => {
                if (data === '0x') {
                  return null
                }
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
                  if (data === '0x') {
                    return null
                  }
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
    // console.log(
    //   'multicall',
    //   lsp2CustomContract.methods
    //     .aggregate3(multicall.map(({ target, call }) => [target, true, call]))
    //     .encodeABI(),
    //   LSP2FetcherWithMulticall3Contract.abi.find(
    //     ({ name }) => name === 'aggregate3'
    //   )
    // )
    await lsp2CustomContract.methods
      .aggregate3(multicall.map(({ target, call }) => [target, true, call]))
      .call()
      .then(async (result: [boolean, string][]) => {
        for (const [i, { query, queries, selector }] of multicall.entries()) {
          const [success, data] = result[i]
          if (queries) {
            if (!success) {
              for (const query of queries) {
                const error = new Error('Call failed')
                ;(error as any).data = data
                query.reject(error)
              }
              continue
            }
            let items = data
            if (selector) {
              items = selector(data)
            }
            for (const [j, query] of queries.entries()) {
              try {
                let item: string | null = items?.[j] || null
                if (['data', 'tokenData'].includes(query.type)) {
                  item = await convert(
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
              let item: string | null = data
              if (['data', 'tokenData'].includes(query?.type || '')) {
                let schema = (
                  (query?.schema as ERC725JSONSchema[]) || defaultSchema
                ).find(({ name }) => name === query?.keyName)
                if (schema && schema.keyType === 'Array') {
                  const array = ABICoder.decodeParameters(
                    ['bytes[]'],
                    item
                  )[0] as string[]
                  schema = { ...schema, keyType: 'Singleton' }
                  query?.resolve(
                    await Promise.all(
                      array.map(value =>
                        convert(
                          query as QueryPromise<
                            unknown,
                            QueryPromiseDataOptions
                          >,
                          value,
                          schema ? [schema] : undefined
                        )
                      )
                    )
                  )
                  continue
                } else {
                  item = await convert(
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
  { interfaceId: INTERFACE_IDS.LSP0ERC725Account, standard: 'LSP3Profile' },
  { interfaceId: INTERFACE_IDS.LSP7DigitalAsset, standard: 'LSP7DigitalAsset' },
  {
    interfaceId: INTERFACE_IDS_v12.LSP7DigitalAsset,
    standard: 'LSP7DigitalAsset',
  },
  {
    interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
    standard: 'LSP8IdentifiableDigitalAsset',
  },
  {
    interfaceId: INTERFACE_IDS_v12.LSP8IdentifiableDigitalAsset,
    standard: 'LSP8IdentifiableDigitalAsset',
  },
]

export function defaultQueryFn<T = any>({ queryKey }: { queryKey: QueryKey }) {
  if (queryTimer) {
    clearTimeout(queryTimer)
  }
  queryTimer = setTimeout(() => {
    queryTimer = undefined
    doQueries()
  }, QUERY_TIMEOUT)
  const isBig = /Big$/.test(queryKey[0] as string)
  const type = (queryKey[0] as string).replace(/Big$/, '') as
    | 'call'
    | 'data'
    | 'tokenData'
  if (type === 'call') {
    const [chainId, address, method, ...args] = queryKey.slice(1)
    const query = createQueryPromise<T, QueryPromiseCallOptions>({
      type,
      isBig,
      chainId: chainId as string,
      address: address as `0x${string}`,
      method: method as string,
      args,
    })
    queryList.push(query as QueryPromise<unknown, QueryPromiseCallOptions>)
    return query.promise
  }
  if (type === 'tokenData') {
    const [chainId, address, tokenId, key, schema, dynamicKeyParts] =
      queryKey.slice(1)
    const query = createQueryPromise<T, QueryPromiseTokenDataOptions>({
      type,
      isBig,
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
  if (type !== 'data') {
    throw Error('Invalid query type')
  }
  const [chainId, address, key, schema, dynamicKeyParts] = queryKey.slice(1)
  const query = createQueryPromise<T, QueryPromiseDataOptions>({
    type,
    isBig,
    chainId: chainId as string,
    address: address as `0x${string}`,
    keyName: key as string,
    schema: schema as ERC725JSONSchema[] | undefined,
    dynamicKeyParts: dynamicKeyParts as string | string[] | undefined,
  })
  queryList.push(query as QueryPromise<unknown, QueryPromiseDataOptions>)
  return query.promise
}
