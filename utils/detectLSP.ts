import { ethers, Signer } from 'ethers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts/constants.js';

import { /* ERC725, */ ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import lsp9Schema from '@erc725/erc725.js/schemas/LSP9Vault.json';

import { COMMON_ABIS /*, IPFS_GATEWAY_BASE_URL*/ } from '../constants';
import { LSPType } from '../interfaces/lsps';

const getSupportedStandardObject = (schemas: ERC725JSONSchema[]) => {
  try {
    const results = schemas.filter((schema) => {
      return schema.name.startsWith('SupportedStandards:');
    });

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    return null;
  }
};

// const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

interface LspTypeOption {
  interfaceId: string; // EIP-165
  lsp2Schema: ERC725JSONSchema | null;
}

const lspTypeOptions: Record<Exclude<LSPType, LSPType.Unknown>, LspTypeOption> =
  {
    [LSPType.LSP3UniversalProfileMetadata]: {
      interfaceId: INTERFACE_IDS.LSP0ERC725Account,
      lsp2Schema: getSupportedStandardObject(lsp3Schema as ERC725JSONSchema[]),
    },
    [LSPType.LSP7DigitalAsset]: {
      interfaceId: INTERFACE_IDS.LSP7DigitalAsset,
      lsp2Schema: getSupportedStandardObject(lsp4Schema as ERC725JSONSchema[]),
    },
    [LSPType.LSP8IdentifiableDigitalAsset]: {
      interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
      lsp2Schema: getSupportedStandardObject(lsp4Schema as ERC725JSONSchema[]),
    },
    [LSPType.LSP9Vault]: {
      interfaceId: INTERFACE_IDS.LSP9Vault,
      lsp2Schema: getSupportedStandardObject(lsp9Schema as ERC725JSONSchema[]),
    },
  };

const detectLSP = async (
  contractAddress: string,
  lspType: LSPType,
  web3Provider: Signer,
  ethersProvider: Signer | ethers.providers.BaseProvider,
) => {
  if (lspType === LSPType.Unknown) {
    return false;
  }

  // EIP-165 detection
  const contract = new ethers.Contract(
    contractAddress,
    COMMON_ABIS.supportsInterface,
    ethersProvider,
  );

  // Check if the contract implements the LSP interface ID
  let doesSupportInterface: boolean;
  try {
    doesSupportInterface = await contract.callStatic.supportsInterface(
      lspTypeOptions[lspType].interfaceId,
    );
  } catch (error) {
    doesSupportInterface = false;
  }

  // Seem like interface check should be enough for checking which standard is used, although we need more detailed detection
  // for legacy standards

  // const lsp2Schema = lspTypeOptions[lspType].lsp2Schema;

  // if (!lsp2Schema) {
  return doesSupportInterface;
  // }

  // ERC725 detection
  // const erc725 = new ERC725(
  //   [lsp2Schema],
  //   contractAddress,
  //   web3Provider,
  //   config,
  // );

  // try {
  //   const lspSupportedStandards = await erc725.fetchData(lsp2Schema.name);
  //   return lspSupportedStandards.value === lsp2Schema.valueContent;
  // } catch (error) {
  //   return false;
  // }
};

export default detectLSP;
