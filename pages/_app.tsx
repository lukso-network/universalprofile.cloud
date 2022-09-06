import '../styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '../components/SideBar/SideBar';
import Head from 'next/head';
import SearchBar from '../components/SearchBar/SearchBar';
import AssetsProvider from '../contexts/AssetsContext';
import WalletAddressProvider from '../contexts/WalletAddressContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssetTransferProvider from '../contexts/AssetTransferContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Universal Profile Wallet</title>
      </Head>
      <div className="bg-black text-white min-h-screen">
        <ToastContainer />
        <AssetsProvider>
          <WalletAddressProvider>
            <AssetTransferProvider>
              <SideBar />
              <div className="ml-[240px]">
                <SearchBar />
                <Component {...pageProps} />
              </div>
            </AssetTransferProvider>
          </WalletAddressProvider>
        </AssetsProvider>
      </div>
    </>
  );
}

export default MyApp;
