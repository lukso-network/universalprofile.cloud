import type { NextPage } from 'next';
import WalletConnector from '../components/WalletConnector';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { WalletAddressContext } from '../contexts/WalletAddressContext';
import { toast } from 'react-toastify';
import { L16_CHAIN_ID } from '../constants';

const ConnectWallets: NextPage = () => {
  const router = useRouter();
  const { setWalletAddress } = useContext(WalletAddressContext);

  const isValidChainId = () => {
    const chainId = parseInt(window.ethereum.networkVersion);
    if (chainId && window.ethereum.networkVersion != L16_CHAIN_ID) {
      toast('Please switch to L16 network');
      return false;
    }
    return true;
  };

  const loginExtension = async () => {
    if (!window.ethereum) {
      alert('Please connect to Universal Profile Extension');
      return;
    }

    try {
      const { ethereum } = window;
      if (!isValidChainId()) return;
      ethereum
        .request({
          method: 'eth_requestAccounts',
        })

        .then(function (accounts: string[]) {
          //find chainId
          if (accounts.length) {
            setWalletAddress(accounts[0]);
            router.push({ pathname: `/${accounts[0]}/overview` });
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold text-center mb-6">Connect to Wallet</h1>
      <div className="flex flex-col">
        <div
          className="flex flex-col items-center py-4 cursor-pointer"
          onClick={loginExtension}
        >
          <img
            src="lukso-icon-256.png"
            alt="lukso image"
            className="w-[40px] h-auto mb-2"
          />
          <div>Universal Profile Extension</div>
        </div>
        <WalletConnector />
      </div>
    </div>
  );
};

export default ConnectWallets;
