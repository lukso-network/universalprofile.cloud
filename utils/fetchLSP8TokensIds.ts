import { ethers } from 'ethers';
import LSP8DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';

const fetchLSP8TokensIds = async (
  contractAddress: string,
  UPAddress: string,
  provider: ethers.providers.BaseProvider,
): Promise<string[]> => {
  const lsp8Contract = new ethers.Contract(
    contractAddress,
    LSP8DigitalAsset.abi,
    provider,
  );
  const tokensIds = (await lsp8Contract.tokenIdsOf(UPAddress)) as string[];
  return tokensIds;
};

export default fetchLSP8TokensIds;
