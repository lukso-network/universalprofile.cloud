import { useEffect, useContext } from 'react';
import { L16_CHAIN_ID } from '../constants';
import { WalletAddressContext } from '../contexts/WalletAddressContext';
import walletConnectConnector from '../utils/walletConnectConnector';
import { useRouter } from 'next/router';

const useWalletConnect = () => {
  const { setWalletAddress } = useContext(WalletAddressContext);

  const router = useRouter();
  let account;

  useEffect(() => {
    const connector = walletConnectConnector();

    if (connector.accounts) {
      account = connector.accounts[0];
      setWalletAddress(account);
    }
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
      if (chainId != L16_CHAIN_ID) {
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
      if (chainId != L16_CHAIN_ID) {
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
  }, [setWalletAddress]);
  return account;
};

export default useWalletConnect;
