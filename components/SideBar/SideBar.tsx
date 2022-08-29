import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { useContext, useEffect } from 'react';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { FiDollarSign } from 'react-icons/fi';
import { L16_CHAIN_ID } from '../../constants';
import { toast } from 'react-toastify';

const SideBar: React.FC = () => {
  const router = useRouter();
  const isOverviewMode = router.pathname.includes('overview');

  const { setWalletAddress, walletAddress } = useContext(WalletAddressContext);

  const verifyChainId = () => {
    const chainId = parseInt(window.ethereum.networkVersion);
    if (chainId && window.ethereum.networkVersion != L16_CHAIN_ID) {
      toast('Please switch to L16 network');
      return false;
    } else {
      return true;
    }
  };

  const isConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        verifyChainId() && setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginExtension = async () => {
    if (!window.ethereum) {
      alert('Please connect to Universal Profile Extension');
      return;
    }

    try {
      const { ethereum } = window;
      if (!verifyChainId()) return;
      await ethereum
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

  const listenForAccountChanges = () => {
    const { ethereum } = window;

    ethereum.on('accountsChanged', function (accounts: string[]) {
      if (accounts.length) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress('');
      }
    });

    ethereum.on('chainChanged', function (networkId: number) {
      if (networkId != 2828) {
        setWalletAddress('');
        toast('Please switch to L16 network');
      }
    });
  };

  useEffect(() => {
    listenForAccountChanges();
    isConnected();
  }, []);

  const renderLogin = () => (
    <>
      <div className="text-gray-300 my-6 leading-5 text-sm h-12">
        Connect to the UP extension to manage your portfolio
      </div>
      <button
        onClick={loginExtension}
        className="flex items-center rounded-lg bg-deepPink py-1 px-4"
      >
        <div className="text-2xl">
          <FiPlus className="text-white" />
        </div>
        <span className="mx-2 text-white text-sm">Connect</span>
      </button>
    </>
  );

  const renderLoggedIn = () => (
    <>
      <div className="text-gray-300 my-6 leading-5 text-sm h-12">
        Manage your portfolio
      </div>
      <Link href={`/${walletAddress}/overview`}>
        <button className="flex items-center rounded-lg bg-deepPink py-1 px-4">
          <div className="text-2xl">
            <FiDollarSign className="text-white" />
          </div>
          <span className="mx-2 text-white text-sm">View</span>
        </button>
      </Link>
    </>
  );

  return (
    <div
      className="fixed bg-lighterBlack left-0 top-0 bottom-0
      w-[240px] flex flex-col px-4"
    >
      <div className="flex flex-col items-center my-8 text-center">
        <div className="text-white font-bold ">{`Welcome to LUKSO's Wallet`}</div>
        {walletAddress ? renderLoggedIn() : renderLogin()}
      </div>
      <div className="border-t border-solid border-1 border-gray-800 py-3">
        <div className="text-sm flex flex-col">
          <Link href="/">
            <div
              className={`flex text-gray-300 items-center mb-10 py-3
                        px-2 rounded-lg hover:bg-gray-700 text-sm cursor-pointer
                        ${isOverviewMode ? 'text-lightPink' : ''}
                      `}
            >
              <AiOutlineEye className="text-2xl mr-3" />
              <div>Overview</div>
            </div>
          </Link>
          {/* TODO: Add Vaults, Send Links when logged in*/}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
