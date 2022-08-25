import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NextLink from 'next/link';
import identicon from 'ethereum-blockies-base64';
import { GiCheckMark } from 'react-icons/gi';
import { useRouter } from 'next/router';

const SearchBar: React.FC = () => {
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (ethers.utils.isAddress(address)) {
      setIsValidAddress(true); //
      router.push(`/overview/${address}`);
    }
    setIsValidAddress(false);
  }, [address]);

  const renderViewButton = () => {
    if (!isValidAddress) {
      return <GiCheckMark className="text-gray-500" />;
    }
    return (
      <NextLink href={`/overview/${address}`}>
        <div className="cursor-pointer w-full h-full flex items-center justify-center">
          <GiCheckMark className="text-green-500" />
        </div>
      </NextLink>
    );
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
        <form>
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
