import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import UniversalProfileSchemas from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

const isUp = async (
  contractAddress: string,
  provider: any,
): Promise<boolean> => {
  try {
    const profile = new ERC725(
      UniversalProfileSchemas as ERC725JSONSchema[],
      contractAddress,
      provider,
    );
    const result = await profile.fetchData(
      'SupportedStandards:LSP3UniversalProfile',
    );
    return result !== undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default isUp;
