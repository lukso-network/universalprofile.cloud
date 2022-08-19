import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AddressContextInterface {
  walletAddress: string;
  setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
}

const initalContext = {
  walletAddress: '',
  setWalletAddress: () => '',
};

export const WalletAddressContext =
  createContext<AddressContextInterface>(initalContext);

interface Props {
  children: React.ReactNode;
}

const WalletAddressProvider: React.FC<Props> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      setWalletAddress(router.query.id as string);
    }
  }, [router]);

  return (
    <WalletAddressContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletAddressContext.Provider>
  );
};

export default WalletAddressProvider;
