import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import identicon from 'ethereum-blockies-base64';
import { GiCheckMark } from 'react-icons/gi';
import { useRouter } from 'next/router';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';

const SearchBar: React.FC = () => {
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const { setLsp7Assets, setLsp8Assets } = useContext(AssetsContext);

  const router = useRouter();

  const { setWalletAddress } = useContext(WalletAddressContext);

  useEffect(() => {
    ethers.utils.isAddress(address)
      ? setValidAddress(true)
      : setValidAddress(false);
  }, [address]);

  const clearGlobalAssets = () => {
    setAddress('');
    setLsp7Assets([]);
    setLsp8Assets([]);
  };

  const renderViewButton = () => {
    if (!validAddress) {
      return <GiCheckMark className="text-gray-500" />;
    }
    return (
      <NextLink href={`/overview/${address}`}>
        <div
          onClick={clearGlobalAssets}
          className="cursor-pointer w-full h-full flex items-center justify-center"
        >
          <GiCheckMark className="text-green-500" />
        </div>
      </NextLink>
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validAddress) {
      setWalletAddress(address);
      router.push(`/overview/${address}`);
    }
  };
  return (
    <div className="border-b border-gray-800 text-xs pb-4">
      <div className="relative flex items-center pt-4 ml-8">
        <div className="bg-darkGray w-[38px] h-full h-[32px] flex items-center justify-center relative rounded-l-md">
          <div className="w-[26px] h-[26px]">
            <img
              src={address ? identicon(address) : identicon('lukso')}
              alt="identicon"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Search by wallet"
            value={address}
            className="py-2
                      px-2  bg-darkGray w-[350px]
                      focus:border-current
                      outline-0 text-white z-10
                      text-xs
                      "
            onChange={(e) => setAddress(e.target.value)}
            spellCheck="false"
            id="skills"
          />
        </form>
        <div
          className={`bg-darkGray w-[38px] h-full
         h-[32px] border-l border-l-gray-500 flex items-center
         justify-center relative rounded-r-md pr-2`}
        >
          {renderViewButton()}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
