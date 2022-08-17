import { ethers, Signer } from 'ethers';
import { INTERFACE_IDS, COMMON_ABIS } from '../constants';

const isLSP7orLSP8 = async (
  contractAddress: string,
  provider: Signer | ethers.providers.BaseProvider,
): Promise<string | void> => {
  const supportsInterfaceAbi = COMMON_ABIS.supportsInterface as any;
  const supportsInterfaceContract = new ethers.Contract(
    contractAddress,
    supportsInterfaceAbi,
    provider,
  );
  try {
    if (
      await supportsInterfaceContract.supportsInterface(
        INTERFACE_IDS.LSP7DigitalAsset,
      )
    ) {
      return 'LSP7';
    } else if (
      await supportsInterfaceContract.supportsInterface(
        INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
      )
    ) {
      return 'LSP8';
    }
  } catch (error) {
    console.log(error);
  }
};

export default isLSP7orLSP8;
