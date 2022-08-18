import '../styles/globals.css';
import type { AppProps } from 'next/app';
import SideBar from '../components/shared/SideBar';
import Head from 'next/head';
import SearchBar from '../components/shared/SearchBar';
import AssetsProvider from '../contexts/AssetsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Universal Profile Wallet</title>
      </Head>
      <div className="bg-black text-white min-h-screen">
        <AssetsProvider>
          <SideBar />
          <div className="ml-[240px]">
            <SearchBar />
            <Component {...pageProps} />
          </div>
        </AssetsProvider>
      </div>
    </>
  );
}

export default MyApp;
