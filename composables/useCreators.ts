// import { useQueries } from '@tanstack/vue-query'

// export const useCreators = (asset?: TokenData) => {
//   // when asset has no creators in array we use owner as fallback
//   const creatorAddressesOrOwner = computed(() => {
//     // if no creators we use contract owner
//     if (!!!asset?.tokenCreators?.length && asset?.creator) {
//       return [asset?.creator]
//     }

//     return asset?.tokenCreators?.filter(Boolean) || []
//   })

//   const creatorQueries = useQueries({
//     queries:
//       creatorAddressesOrOwner.value.map(creatorAddress => ({
//         queryKey: ['profile', creatorAddress],
//         queryFn: () => fetchAndStoreProfile(creatorAddress as Address),
//       })) || [],
//     combine: results => {
//       return {
//         data: results.map(result => result.data),
//         isPending: results.some(result => {
//           return result.isPending
//         }),
//       }
//     },
//   })

//   const creators = computed(() => creatorQueries.value.data?.filter(Boolean))

//   const firstCreator = computed(() => creators.value[0])

//   const restOfCreators = computed(() => creators.value?.slice(1) || [])

//   const isPending = computed(() => creatorQueries.value.isPending)

//   const isVerified = (creatorProfile?: Profile) =>
//     asset?.address &&
//     creatorProfile?.issuedAssetAddresses?.includes(asset?.address)

//   return {
//     creators,
//     firstCreator,
//     restOfCreators,
//     isPending,
//     creatorAddressesOrOwner,
//     isVerified,
//   }
// }
