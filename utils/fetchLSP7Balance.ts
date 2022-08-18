import { ethers } from 'ethers';
import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';

const fetchLSP7Balance = async (
  contractAddress: string,
  UPAddress: string,
  provider: ethers.providers.BaseProvider,
): Promise<number> => {
  const lsp7Contract = new ethers.Contract(
    contractAddress,
    LSP7DigitalAsset.abi,
    provider,
  );
  const balance = await lsp7Contract.balanceOf(UPAddress);
  return balance.toNumber();
};

export default fetchLSP7Balance;
