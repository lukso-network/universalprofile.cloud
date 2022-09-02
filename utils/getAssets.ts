import { ethers } from 'ethers';

import { LSPType } from '../interfaces/lsps';
import isLSP7orLSP8 from './isLSP7orLSP8';

const getAssets = async (
  assetsAddresses: string[],
  provider: ethers.providers.BaseProvider,
) => {
  const lsp7AddressesTemp: string[] = [];
  const lsp8AddressesTemp: string[] = [];

  //fetch the different assets types
  await Promise.all(
    assetsAddresses.map(async (assetAddress) => {
      const assetType = await isLSP7orLSP8(assetAddress, provider);
      switch (assetType) {
        case LSPType.LSP7:
          lsp7AddressesTemp.push(assetAddress);
          break;
        case LSPType.LSP8:
          lsp8AddressesTemp.push(assetAddress);
          break;
        default:
          break;
      }
    }),
  );

  return {
    lsp7Addresses: lsp7AddressesTemp,
    lsp8Addresses: lsp8AddressesTemp,
  };
};

export default getAssets;
