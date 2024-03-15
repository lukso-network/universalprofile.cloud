import { Buffer } from 'buffer'
import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP4DigitalAssetMetadataContract from '@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json'
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'
import LSP3Schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import LSP8Schema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import { RateLimiter } from 'limiter'
import {
  decodeData,
  getDataFromExternalSources,
  encodeKeyName,
  type ERC725JSONSchema,
} from '@erc725/erc725.js'
import {
  type AbiItem,
  type Hex,
  hexToBytes,
  toNumber,
  bytesToHex,
} from 'web3-utils'
import ABICoder from 'web3-eth-abi'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import { INTERFACE_IDS as INTERFACE_IDS_v12 } from '@lukso/lsp-smart-contracts-12'
import { type QueryFunction } from '@tanstack/vue-query'

import LSP2FetcherWithMulticall3Contract from '@/shared/abis/LSP2FetcherWithMulticall3.json'

import type { LSP2FetcherWithMulticall3 } from '@/contracts/LSP2FetcherWithMulticall3'

const QUERY_TIMEOUT = 250
const MAX_BIG_PER_MULTICALL = 2
const MAX_PARALLEL_REQUESTS = 5
const MAX_AGGREGATE_COUNT = 20
const MAX_AGGREGATE_DATA_LIMIT = 75 * 1024
const DATA_SLICE_MARGIN = 64 * 10

export type QueryPromiseCallOptions = {
  type: 'call'
  isBig: boolean
  chainId: string
  address: Address
  method: string
  abi?: AbiItem
  args: readonly unknown[]
}
export type QueryPromiseDataOptions = {
  type: 'getData'
  isBig: boolean
  chainId: string
  address: Address
  tokenId?: `0x${string}`
  keyName: string
  dynamicKeyParts?: string | string[]
  schema?: readonly ERC725JSONSchema[]
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

export type Multicall = {
  index: number
  target: string
  call: string
  query?: QueryPromise<any>
  queries?: Array<QueryPromise<any>>
  selector?: (data: any) => any
  extract?: (data: string) => string
}

export type Remainder = {
  query: QueryPromise
  selector?: (data: any) => any
  data: string
}

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
  QueryPromise<unknown, QueryPromiseCallOptions | QueryPromiseDataOptions>
> = []
export const defaultSchema: readonly ERC725JSONSchema[] = [
  ...LSP4Schema,
  ...LSP3Schema,
  ...LSP8Schema,
]
export const defaultAbi: readonly AbiItem[] = [
  ...(LSP8IdentifiableDigitalAssetContract.abi as AbiItem[]),
  ...(LSP7DigitalAssetContract.abi as AbiItem[]),
  ...(LSP4DigitalAssetMetadataContract.abi as AbiItem[]),
]

// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
const limiter = new RateLimiter({ tokensPerInterval: 80, interval: 'second' })

async function convert<T = any>(
  query: QueryPromise<unknown, QueryPromiseDataOptions>,
  data: string | null,
  overrideSchema?: readonly ERC725JSONSchema[]
): Promise<T | null> {
  if (data == undefined) {
    return null
  }
  const { keyName, schema, dynamicKeyParts } = query
  let info = decodeData(
    [
      {
        keyName: keyName as string,
        value: data,
        dynamicKeyParts,
      },
    ],
    overrideSchema || schema || (defaultSchema as any)
  )
  const value = info.find(({ name }) => name == keyName)?.value
  if (value == undefined) {
    return null
  }
  try {
    info = await getDataFromExternalSources(
      (overrideSchema || defaultSchema) as any,
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

const multicall: Multicall[] = []
const singlecall: Multicall[] = []
let running = 0

async function doQueries() {
  if (running > MAX_PARALLEL_REQUESTS) {
    return
  }
  running++
  try {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { customLSP2ContractAddress: LSP2ContractAddress, chainId } =
      currentNetwork.value
    const allBigQueries: QueryPromise<
      unknown,
      QueryPromiseDataOptions | QueryPromiseCallOptions
    >[] = []
    const queries: QueryPromise<
      unknown,
      QueryPromiseDataOptions | QueryPromiseCallOptions
    >[] = []
    while (true) {
      const query = queryList.shift()
      if (!query) {
        break
      }
      if (query.chainId !== chainId) {
        try {
          query.reject(new Error('Query cancelled'))
        } catch {
          // Ignore
        }
        continue
      }
      if (query.isBig) {
        allBigQueries.push(query)
        if (allBigQueries.length >= MAX_PARALLEL_REQUESTS - 1) {
          break
        }
      } else {
        queries.push(query)
        if (queries.length > MAX_AGGREGATE_COUNT) {
          break
        }
      }
    }
    const split: Record<
      string,
      {
        call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
        getData?: QueryPromise<unknown, QueryPromiseDataOptions>[]
        getDataForTokenId?: QueryPromise<unknown, QueryPromiseDataOptions>[]
      }
    > = queries.reduce(
      (acc, query) => {
        if (!acc[query.address]) {
          acc[query.address] = {}
        }
        const type =
          query.type === 'getData' &&
          query.tokenId &&
          !/\[\]$/.test(query.keyName)
            ? 'getDataForTokenId'
            : query.type
        let items = acc[query.address][type] as QueryPromise<
          unknown,
          QueryPromiseCallOptions | QueryPromiseDataOptions
        >[]
        if (!items) {
          items = acc[query.address][type] = []
        }
        items.push(query)
        return acc
      },
      {} as Record<
        string,
        {
          call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
          getData?: QueryPromise<unknown, QueryPromiseDataOptions>[]
          getDataForTokenId?: QueryPromise<unknown, QueryPromiseDataOptions>[]
        }
      >
    )

    const { contract, getWeb3 } = useWeb3(PROVIDERS.RPC)
    const lsp2CustomContract = contract<LSP2FetcherWithMulticall3>(
      LSP2FetcherWithMulticall3Contract.abi as AbiItem[],
      LSP2ContractAddress
    )

    try {
      for (const [
        address,
        { getData, getDataForTokenId, call },
      ] of Object.entries(split)) {
        if (getDataForTokenId) {
          const tokenIds = getDataForTokenId.reduce(
            (
              tokenIds: Record<
                string,
                QueryPromise<unknown, QueryPromiseDataOptions>[]
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
              QueryPromise<unknown, QueryPromiseDataOptions>[]
            >
          )
          for (const tokenQueries of Object.values(tokenIds)) {
            const { address } = tokenQueries[0]
            const abi = LSP4DigitalAssetMetadataContract.abi.find(
              item =>
                item.type === 'function' &&
                item.name === 'getDataBatchForTokenIds'
            )
            if (abi) {
              const call = ABICoder.encodeFunctionCall(
                abi as unknown as AbiItem,
                [
                  tokenQueries.map(
                    ({ tokenId }) => tokenId
                  ) as unknown as string,
                  tokenQueries.map(({ keyName, dynamicKeyParts }) =>
                    encodeKeyName(keyName, dynamicKeyParts)
                  ) as unknown as string,
                ]
              )
              multicall.push({
                index: multicall.length,
                target: address,
                call,
                queries: tokenQueries as unknown as QueryPromise<any>[],
                selector(data: string) {
                  if (data === '0x') {
                    return null
                  }
                  try {
                    return ABICoder.decodeParameters(
                      (abi?.outputs || []).slice(),
                      data
                    )[0]
                  } catch (error) {
                    console.error('decodeParameters', error)
                    return null
                  }
                },
              })
            }
          }
        }

        if (getData) {
          const plainKeys = getData.filter(
            ({ keyName }) => !/\[\]$/.test(keyName)
          )
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
              queries: getData,
              selector(data: string) {
                if (data === '0x') {
                  return null
                }
                return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
              },
            })
          }
          const arrayKeys = getData.filter(({ keyName }) =>
            /\[\]$/.test(keyName)
          )
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
                selector(data: string) {
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
              const abi = defaultAbi.find(item => {
                if (item.type !== 'function') {
                  return false
                }
                const { name, inputs } = item
                return (
                  name === query.method.replace(/\(.*$/, '') &&
                  `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                    query.method
                )
              })
              if (abi) {
                const call = ABICoder.encodeFunctionCall(
                  abi as AbiItem,
                  (query.args || []) as string[]
                )
                multicall.push({
                  index: multicall.length,
                  target: '0x0000000000000000000000000000000000000000',
                  call,
                  query,
                  selector(data: string) {
                    return ABICoder.decodeParameters(
                      abi?.outputs || [],
                      data
                    )[0]
                  },
                })
              } else {
                query.reject(new Error('Method not found'))
              }
            } else {
              const abi =
                query.abi ||
                defaultAbi.find(item => {
                  if (item.type !== 'function') {
                    return false
                  }
                  const { name, inputs } = item
                  return (
                    name === query.method.replace(/\(.*$/, '') &&
                    `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                      query.method
                  )
                })
              if (abi) {
                const call = ABICoder.encodeFunctionCall(
                  abi as AbiItem,
                  (query.args || []) as string[]
                )
                multicall.push({
                  index: multicall.length,
                  target: address,
                  call,
                  query,
                  selector(data: string) {
                    if (data === '0x') {
                      return null
                    }
                    return ABICoder.decodeParameters(
                      (abi?.outputs || []) as any,
                      data
                    )[0]
                  },
                })
              } else {
                query.reject(new Error('Method not found'))
              }
            }
          }
        }
      }

      allBigQueries.forEach(query => {
        const { keyName, dynamicKeyParts, address, type, tokenId } = query
        if (type === 'getData') {
          const abi = LSP8IdentifiableDigitalAssetContract.abi.find(
            ({ name }) => name === (tokenId ? 'getDataForTokenId' : 'getData')
          )
          const key = encodeKeyName(keyName, dynamicKeyParts)
          const call = ABICoder.encodeFunctionCall(
            abi as AbiItem,
            (tokenId ? [tokenId, key] : [key]) as unknown as string[]
          )
          singlecall.push({
            index: singlecall.length,
            target: address,
            call,
            query,
            selector(data: string) {
              if (data === '0x') {
                return null
              }
              return ABICoder.decodeParameters(
                (abi?.outputs || []) as any,
                data
              )[0]
            },
          })
        } else if (type === 'call') {
          const abi =
            query.abi ||
            defaultAbi.find(item => {
              if (item.type !== 'function') {
                return false
              }
              const { name, inputs } = item
              return (
                name === query.method.replace(/\(.*$/, '') &&
                `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                  query.method
              )
            })
          if (abi) {
            const call = ABICoder.encodeFunctionCall(
              abi as AbiItem,
              (query.args || []) as string[]
            )
            singlecall.push({
              index: singlecall.length,
              target: address,
              call,
              query,
              selector(data: string) {
                if (data === '0x') {
                  return null
                }
                return ABICoder.decodeParameters(
                  (abi?.outputs || []) as any,
                  data
                )[0]
              },
            })
          } else {
            query.reject(new Error('Method not found'))
          }
        }
      })
      await limiter.removeTokens(1)
      const doSinglecall = async (singlecall: Multicall) => {
        const web3 = getWeb3()
        const { target, call } = singlecall
        try {
          let data: any = await web3.eth.call({
            to: target,
            data: call,
          })
          if (singlecall.extract) {
            data = singlecall.extract.call(singlecall, data)
          }
          if (singlecall.selector) {
            data = singlecall.selector.call(singlecall, data)
          }
          if ('getData' === singlecall.query?.type) {
            data = await convert(
              singlecall.query as QueryPromise<
                unknown,
                QueryPromiseDataOptions
              >,
              data
            )
          }
          singlecall.query?.resolve(data)
        } catch (error) {
          singlecall.query?.reject(error)
        }
      }
      const doMulticall = async (multicall: Multicall[]) => {
        multicall = multicall.splice(0, multicall.length)
        await lsp2CustomContract.methods
          .aggregate4(
            multicall.map(({ target, call }) => [target, true, call]),
            MAX_AGGREGATE_DATA_LIMIT
          )
          .call()
          .then(
            async (result: [string | number, string | number, string][]) => {
              for (const [i, multiItem] of multicall.entries()) {
                const { query, queries, selector, extract } = multiItem
                const [_success, , _data] = result[i]
                const success = toNumber(_success, false) as number
                if (success === 3) {
                  multicall.push(multiItem)
                  triggerQuery()
                  continue
                }
                if (success === 2) {
                  ;(query ? [query] : queries)?.forEach(query => {
                    query.isBig = true
                    queryList.splice(0, 0, query)
                  })
                  triggerQuery()
                  continue
                }
                let rawData = _data
                if (extract) {
                  rawData = extract.call(multiItem, rawData)
                }
                const data = rawData
                if (queries) {
                  if (!success) {
                    for (const query of queries) {
                      // Normal success=false means the call is not supported
                      query.resolve(null)
                    }
                    continue
                  }
                  let items = data
                  try {
                    if (selector) {
                      items = selector.call(multiItem, data)
                    }
                  } catch (error) {
                    for (const query of queries) {
                      query.reject(error)
                    }
                    continue
                  }
                  for (const [j, query] of queries.entries()) {
                    try {
                      let item: string | null = items?.[j] || null
                      if ('getData' === query.type) {
                        item = await convert(
                          query as QueryPromise<
                            unknown,
                            QueryPromiseDataOptions
                          >,
                          item
                        )
                      }
                      if (success) {
                        query.resolve(item)
                      } else {
                        // Normal success=false means the call is not supported
                        query.resolve(null)
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
                    if ('getData' === query?.type) {
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
                        if (selector) {
                          item = selector.call(multiItem, item)
                        }
                        item = await convert(
                          query as QueryPromise<
                            unknown,
                            QueryPromiseDataOptions
                          >,
                          item
                        )
                      }
                    } else if (selector) {
                      item = selector.call(multiItem, item)
                    }
                    query?.resolve(item)
                  } else {
                    // Normal success=false means the call is not supported
                    query?.resolve(null)
                  }
                } catch (error) {
                  try {
                    // This is an actual error so reject
                    query?.reject(error)
                  } catch {
                    // Really ignore, we tried our best
                  }
                }
              }
            }
          )
          .catch((error: Error) => {
            // console.error(
            //   'failure',
            //   error,
            //   multicall.length,
            //   multicall.map(({ query, queries }) => ({
            //     type: query?.type || queries?.[0].type + 'Batch',
            //     keyName:
            //       query?.keyName || queries?.map(({ keyName }) => keyName),
            //   }))
            // )
            console.error(error)
            throw error
          })
      }
      running++
      try {
        await doMulticall(multicall)
      } finally {
        running--
      }
      while (running < MAX_PARALLEL_REQUESTS && singlecall.length > 0) {
        running++
        try {
          await doSinglecall(singlecall.shift() as Multicall)
        } finally {
          running--
        }
      }
      while (running < MAX_PARALLEL_REQUESTS && multicall.length > 0) {
        running++
        try {
          await doMulticall(multicall)
        } finally {
          running--
        }
      }
    } catch (error) {
      for (const query of queries) {
        query.reject(error)
      }
    }
  } finally {
    running--
    if (queryList.length > 0 || multicall.length > 0 || singlecall.length > 0) {
      triggerQuery()
    }
  }
}

export type Interface = {
  interfaceId: `0x${string}`
  standard: 'LSP3Profile' | 'LSP7DigitalAsset' | 'LSP8IdentifiableDigitalAsset'
}
export const interfacesToCheck: Interface[] = [
  {
    interfaceId: INTERFACE_IDS.LSP0ERC725Account as `0x${string}`,
    standard: 'LSP3Profile',
  },
  {
    interfaceId: INTERFACE_IDS.LSP7DigitalAsset as `0x${string}`,
    standard: 'LSP7DigitalAsset',
  },
  {
    interfaceId: INTERFACE_IDS_v12.LSP7DigitalAsset as `0x${string}`,
    standard: 'LSP7DigitalAsset',
  },
  {
    interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset as `0x${string}`,
    standard: 'LSP8IdentifiableDigitalAsset',
  },
  {
    interfaceId:
      INTERFACE_IDS_v12.LSP8IdentifiableDigitalAsset as `0x${string}`,
    standard: 'LSP8IdentifiableDigitalAsset',
  },
]

export function triggerQuery() {
  if (queryTimer) {
    clearTimeout(queryTimer)
  }
  queryTimer = setTimeout(() => {
    queryTimer = undefined
    nextTick(doQueries)
  }, QUERY_TIMEOUT)
}

export type QFQueryOptions<T = unknown> = {
  queryKey: readonly unknown[]
  queryFn: QueryFunction<T, readonly unknown[]>
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
}

export type CallContractQueryOptions = {
  abi?: readonly AbiItem[]
  address: Address
  method: string
  args?: readonly unknown[]
  chainId: string
  isBig?: boolean
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
}

export function queryCallContract<T>({
  abi,
  address,
  method,
  args = [],
  chainId,
  isBig = false,
  staleTime,
  refetchInterval,
  retry,
}: CallContractQueryOptions): QFQueryOptions<T> {
  const methodName = method.replace(/\(.*$/, '')
  let methodItem = (abi || defaultAbi).find(item => {
    if (item.type !== 'function') {
      return false
    }
    const { name, inputs } = item
    return (
      name === methodName &&
      `${name}(${inputs?.map(({ type }) => type).join(',')})` === method
    )
  })
  if (!methodItem) {
    console.warn(
      `Method ${method} not found in abi so we will not decode result data`
    )
    methodItem = {
      name: methodName,
      type: 'function',
      inputs: method
        .replace(/.*\(/, '')
        .replace(/\)/, '')
        .split(',')
        .map((content, index) => {
          const [type, name] = content.split(' ')
          return {
            type: type.trim().replace(/ .*$/, ''),
            name: name || `arg${index}`,
          }
        }),
    }
  }
  return {
    ...(staleTime ? { staleTime } : {}),
    ...(refetchInterval ? { refetchInterval } : {}),
    ...(retry ? { retry } : { retry: false }),
    queryKey: [
      'call',
      chainId,
      address,
      method,
      ...(args ? (args as unknown as unknown[]) : []),
    ] as readonly unknown[],
    queryFn: async (): Promise<T> => {
      const query = createQueryPromise<T>({
        type: 'call',
        isBig,
        chainId,
        abi: methodItem,
        address,
        method,
        args,
      })
      queryList.push(query as QueryPromise<T, QueryPromiseCallOptions>)
      triggerQuery()
      return query.promise
    },
  }
}

export type GetDataQueryOptions = {
  address: Address
  chainId: string
  keyName: string
  schema?: readonly ERC725JSONSchema[]
  tokenId?: string
  isBig?: boolean
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
}

export type VerifiableURI = {
  verification: {
    method: Hex | 'keccak256(utf8)' | 'keccak256(bytes)'
    data: Hex
  }
  url: string
}

export function queryGetData<T>({
  address,
  chainId,
  keyName,
  schema,
  tokenId,
  isBig,
  staleTime,
  refetchInterval,
  retry,
}: GetDataQueryOptions): QFQueryOptions<T> {
  const schemaItem = (schema || defaultSchema).find(
    ({ name }) => name === keyName
  )
  return {
    ...(staleTime ? { staleTime } : {}),
    ...(refetchInterval ? { refetchInterval } : {}),
    ...(retry ? { retry } : { retry: false }),
    queryKey: [
      tokenId ? 'getDataForTokenId' : 'getData',
      chainId,
      address,
      ...(tokenId ? [tokenId] : []),
      keyName,
      schemaItem,
    ],
    queryFn: async (): Promise<T> => {
      const query = createQueryPromise({
        type: 'getData',
        isBig,
        chainId,
        address,
        tokenId,
        keyName,
        schema: [schemaItem],
      })
      queryList.push(query as QueryPromise<unknown, QueryPromiseDataOptions>)
      triggerQuery()
      return query.promise as Promise<T>
    },
  }
}
