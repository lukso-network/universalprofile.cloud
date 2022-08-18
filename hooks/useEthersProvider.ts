import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { L16_RPC_URL } from '../constants';

const useEthersProvider = () => {
  const [provider, setProvider] = useState<ethers.providers.BaseProvider>();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(L16_RPC_URL);
    setProvider(provider);
  }, []);

  return provider;
};

export default useEthersProvider;
