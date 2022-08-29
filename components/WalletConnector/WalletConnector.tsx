import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import { useContext } from 'react';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { useRouter } from 'next/router';

const WalletConnector = () => {
  const { setWalletAddress } = useContext(WalletAddressContext);
  const router = useRouter();
  const showModal = async () => {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }

    // Subscribe to connection events
    connector.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      if (chainId != 2828) {
        alert('Please switch to L16 network');
        return;
      }
      setWalletAddress(accounts[0]);
      router.push({ pathname: `/${accounts[0]}/overview` });
    });

    connector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      if (chainId != 2828) {
        alert('Please switch to L16 network');
        return;
      }
      setWalletAddress(accounts[0]);
    });

    connector.on('disconnect', (error) => {
      if (error) {
        throw error;
      }

      // Delete connector
      setWalletAddress('');
    });
  };

  return (
    <div
      className="flex flex-col items-center py-4 cursor-pointer"
      onClick={() => showModal()}
    >
      <img
        src="./WalletConnect-icon.png"
        alt="walletConnect image"
        className="w-[40px] h-auto mb-2"
      />
      <div>WalletConnect</div>
    </div>
  );
};

export default WalletConnector;
