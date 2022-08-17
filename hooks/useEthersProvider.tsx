import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { L16_RPC_URL } from '../constants';
import { ethersProvider } from '../types';

const useEthersProvider = () => {
  const [provider, setProvider] = useState<ethersProvider>();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(L16_RPC_URL);
    setProvider(provider);
  }, []);

  return provider;
};

export default useEthersProvider;
