import { ethers, Signer } from 'ethers';

import { LSPType } from '../interfaces/lsps';
import detectLSP from './detectLSP';

const getAssets = async (
  assetsAddresses: string[],
  web3Provider: Signer,
  ethersProvider: Signer | ethers.providers.BaseProvider,
) => {
  const lsp7AddressesTemp: string[] = [];
  const lsp8AddressesTemp: string[] = [];

  //fetch the different assets types
  await Promise.all(
    assetsAddresses.map(async (assetAddress) => {
      const isLSP7 = await detectLSP(
        assetAddress,
        LSPType.LSP7DigitalAsset,
        web3Provider,
        ethersProvider,
      );

      const isLSP8 = await detectLSP(
        assetAddress,
        LSPType.LSP8IdentifiableDigitalAsset,
        web3Provider,
        ethersProvider,
      );

      if (isLSP7 && !isLSP8) {
        lsp7AddressesTemp.push(assetAddress);
      } else if (isLSP8 && !isLSP7) {
        lsp8AddressesTemp.push(assetAddress);
      } else {
        console.log('asset is not an LSP');
      }
    }),
  );

  return {
    lsp7Addresses: lsp7AddressesTemp,
    lsp8Addresses: lsp8AddressesTemp,
  };
};

export default getAssets;
