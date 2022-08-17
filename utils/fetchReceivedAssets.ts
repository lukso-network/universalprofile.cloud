import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import UniversalProfileSchema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';


const fetchReceivedAssets = async (address: string, provider: any):Promise<string[]> => {

  const profile = new ERC725(UniversalProfileSchema as ERC725JSONSchema[],address, provider);
  const result = await profile.fetchData('LSP5ReceivedAssets[]');
  const ownedAssets = result.value as string[]; //returns array of addresses
  return ownedAssets;
}

export default fetchReceivedAssets;
