import { createContext, useState } from 'react';

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

  return (
    <WalletAddressContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletAddressContext.Provider>
  );
};

export default WalletAddressProvider;
