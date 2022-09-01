import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import LSP12Schemas from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';
import LSP4Schemas from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

const verifyCreatorShip = async (
  ownerAddress: string,
  provider: any,
  issuedAssetAddress: string,
): Promise<boolean> => {
  const erc725Asset = new ERC725js(
    LSP4Schemas as ERC725JSONSchema[],
    issuedAssetAddress,
    provider,
  );
  try {
    const fetchCreators = await erc725Asset.fetchData('LSP4Creators[]');
    const creators = fetchCreators.value as string[];
    creators.filter((creator) => {
      if (creator === ownerAddress) {
        return true;
      }
    });
    return false;
  } catch (er) {
    console.log(er);
    return false;
  }
};

const fetchCreatedAssets = async (
  provider: any,
  issuerAddress: string,
): Promise<string[]> => {
  const erc725 = new ERC725js(
    LSP12Schemas as ERC725JSONSchema[],
    issuerAddress,
    provider,
  );
  try {
    const fetchCreatedAssetsAddresses = await erc725.fetchData(
      'LSP12IssuedAssets[]',
    );
    const issuedAssetsAddresses = fetchCreatedAssetsAddresses.value as string[];

    if (issuedAssetsAddresses.length) {
      await Promise.all(
        issuedAssetsAddresses.map(async (assetAddress) => {
          const isCreator = await verifyCreatorShip(
            issuerAddress,
            provider,
            assetAddress,
          );
          if (isCreator) {
            return assetAddress;
          }
        }),
      );
      return issuedAssetsAddresses;
    }
    return [];
  } catch (er) {
    console.log(er);
    return [];
  }
};

export default fetchCreatedAssets;
