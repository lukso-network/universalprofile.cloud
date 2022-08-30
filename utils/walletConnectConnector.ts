import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

const WALLET_CONNECT_BRIDGE_URL = 'https://bridge.walletconnect.org';

const walletConnectConnector = () => {
  const connector = new WalletConnect({
    bridge: WALLET_CONNECT_BRIDGE_URL, // Required
    qrcodeModal: QRCodeModal,
  });
  return connector;
};

export default walletConnectConnector;
