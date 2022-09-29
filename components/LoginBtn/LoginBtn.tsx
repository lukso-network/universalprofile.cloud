import { useEffect, useContext, useState } from 'react';
import identicon from 'ethereum-blockies-base64';

import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import useWalletConnect from '../../hooks/useWalletConnect';
import { IPFS_GATEWAY_BASE_URL, L16_CHAIN_ID } from '../../constants';
import { toast } from 'react-toastify';
import walletConnectConnector from '../../utils/walletConnectConnector';
import Link from 'next/link';
import { LSP3Profile } from '../../interfaces/lsps';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import { validateLSP3 } from '../../utils/validateLSP3';
import fetchUPInfos from '../../utils/fechUpInfos';

const LoginBtn: React.FC = () => {
  const { setWalletAddress, walletAddress } = useContext(WalletAddressContext);

  const [lsp3JSON, setLsp3JSON] = useState<LSP3Profile>();

  useWalletConnect();
  const web3Provider = useWeb3Provider();

  const isValidChainId = () => {
    const chainId = parseInt(window.ethereum.networkVersion);
    if (chainId && window.ethereum.networkVersion != L16_CHAIN_ID) {
      toast('Please switch to L16 network');
      return false;
    }
    return true;
  };

  const getUPInfos = async () => {
    const LSP3Profile = await fetchUPInfos(walletAddress, web3Provider);
    if (LSP3Profile) {
      const formattedLSP3 = validateLSP3(LSP3Profile[0].value);
      setLsp3JSON(formattedLSP3);
    }
  };

  const userAvatar = (LSP3ProfileJSON: LSP3Profile): string => {
    if (LSP3ProfileJSON.LSP3Profile?.profileImage[0]?.url) {
      const LSP3ProfileImage = LSP3ProfileJSON.LSP3Profile.profileImage[0].url;
      if (LSP3ProfileImage.includes('ipfs://')) {
        return `${IPFS_GATEWAY_BASE_URL}${
          LSP3ProfileImage.split('ipfs://')[1]
        }`;
      }

      return LSP3ProfileJSON?.LSP3Profile?.profileImage[0].url;
    }
    return identicon(walletAddress);
  };

  const isConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        isValidChainId() && setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listenForAccountChanges = () => {
    const { ethereum } = window;

    if (!ethereum) return;

    //added this line below because when using walletconnect,
    //so that that listenForAccountChanges does not override the walletConnect account state
    //but this function will be useful when connected through UP extension
    const walletConnectorAccount = walletConnectConnector().accounts[0];
    if (walletConnectorAccount) {
      return;
    }

    ethereum.on('accountsChanged', function (accounts: string[]) {
      if (walletAddress) {
        return;
      }
      if (accounts.length) {
        setWalletAddress(accounts[0]);
        return;
      }
      setWalletAddress('');
    });

    ethereum.on('chainChanged', function (networkId: number) {
      if (networkId !== L16_CHAIN_ID) {
        setWalletAddress('');
        toast('Please switch to L16 network');
      }
    });
  };

  const addressFirstFour = () => walletAddress?.slice(2, 6);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    listenForAccountChanges();
    isConnected();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getUPInfos();
    }
  }, [walletAddress]);

  const renderLogin = () => (
    <>
      <Link href="/connect-wallets">
        <button className="flex items-center rounded-lg text-deepPink border border-deepPink py-1 px-4">
          <span className="mx-2 text-sm">Connect</span>
        </button>
      </Link>
    </>
  );

  const renderLoggedIn = () => (
    <Link href={`/${walletAddress}/overview`}>
      <button className="flex border border-deepPink items-center rounded-lg text-deepPink py-1 px-4">
        {lsp3JSON && (
          <img
            src={userAvatar(lsp3JSON)}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="mx-2 text-sm">
          {lsp3JSON?.LSP3Profile?.name
            ? `${lsp3JSON?.LSP3Profile?.name}#${addressFirstFour()}`
            : formatAddress(walletAddress)}
        </span>
      </button>
    </Link>
  );

  return <div> {walletAddress ? renderLoggedIn() : renderLogin()}</div>;
};

export default LoginBtn;
