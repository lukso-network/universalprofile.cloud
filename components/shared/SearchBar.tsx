import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';

const SearchBar: React.FC = () => {
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const { setLsp7Assets, setLsp8Assets } = useContext(AssetsContext);

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

  const renderDownshiftMenu = () => (
    <>
      {validAddress ? (
        <div className="cursor-pointer" onClick={() => clearGlobalAssets()}>
          <NextLink href={`/overview/${address}`}>
            <div>{address}</div>
          </NextLink>
        </div>
      ) : (
        <div>Invalid address</div>
      )}
    </>
  );

  return (
    <div className="border-b border-gray-800">
      <input
        placeholder="Search by wallet"
        value={address}
        className="my-4 ml-8 rounded-md py-1
                  px-2 bg-darkGray text-gray-300 w-[400px] text-sm
                  text-gray-400 focus:border-current focus:ring-0
                  "
        onChange={(e) => setAddress(e.target.value)}
      />
      {address && renderDownshiftMenu()}
    </div>
  );
};

export default SearchBar;
