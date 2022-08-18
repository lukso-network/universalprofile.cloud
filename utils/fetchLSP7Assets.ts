import fetchLSP4Metadata from './fetchLSP4Metadata';
import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import { LSP4Metadata } from '../interfaces/lsps';
import { L16_RPC_URL, luksoImg } from '../constants';
import { Lsp7AssetType } from '../contexts/AssetsContext';
import Web3 from 'web3';

const fetchLSP7Assets = async (
  assetAddress: string,
  UPAddress: string,
  web3Provider: any,
): Promise<Lsp7AssetType | undefined> => {
  const LSP4MetadataResponse = await fetchLSP4Metadata(
    assetAddress,
    web3Provider,
  );

  //fetch amount of tokens received
  const tokenBalance = await fetchLSP7Balance(
    assetAddress,
    UPAddress,
    web3Provider,
  );

  if (tokenBalance == 0) {
    return;
  }
  const lsp7Object = createLSP7Object(
    LSP4MetadataResponse,
    tokenBalance,
    assetAddress,
  );
  return lsp7Object;
};

const fetchLSP7Balance = async (
  contractAddress: string,
  UPAddress: string,
  web3Provider: any,
): Promise<number> => {
  const web3 = new Web3(L16_RPC_URL);
  const lsp7Contract = new web3.eth.Contract(
    LSP7DigitalAsset.abi as any,
    contractAddress,
  );

  const balance = await lsp7Contract.methods.balanceOf(UPAddress).call();
  return balance;
};

const createLSP7Object = (
  LSP4MetadataResponse: [string, string, LSP4Metadata],
  tokenBalance: number,
  assetAddress: string,
): Lsp7AssetType => {
  let [LSP4TokenName, LSP4TokenSymbol, LSP4MetadataJSON] = LSP4MetadataResponse;
  const lsp7AssetObject = {
    name: LSP4TokenName,
    symbol: LSP4TokenSymbol,
    amount: tokenBalance,
    icon: LSP4MetadataJSON.LSP4Metadata.icons[0]?.url
      ? LSP4MetadataJSON.LSP4Metadata.icons[0]?.url
      : luksoImg,
    address: assetAddress,
  };
  return lsp7AssetObject;
};

export default fetchLSP7Assets;
