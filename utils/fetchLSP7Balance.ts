import {ethers} from 'ethers'
import { ethersProvider } from '../types';
import LSP7DigitalAsset from '../contracts/LSP7DigitalAsset.json';

const fetchLSP7Balance = async (contractAddress: string, UPAddress: string, provider: ethersProvider):Promise<number> => {

  const lsp7Contract= new ethers.Contract(contractAddress, LSP7DigitalAsset.abi, provider);
  const balance = await lsp7Contract.balanceOf(UPAddress);
  return balance.toNumber();
}

export default fetchLSP7Balance;
