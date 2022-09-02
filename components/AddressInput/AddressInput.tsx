import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import erc725Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import identicon from 'ethereum-blockies-base64';

import useWeb3Provider from '../../hooks/useWeb3Provider';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { validateLSP3 } from '../../utils/validateLSP3';
import { LSP3Profile } from '../../interfaces/lsps';

const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

interface AddressInfo {
  address: string;
  isUniversalProfile: boolean;
  LSP3JSON?: LSP3Profile;
}

interface Props {
  inputAddress: string;
  onChange: (updatedAddressInfos: AddressInfo) => void;
}

const AddressInput: React.FC<Props> = ({ inputAddress, onChange }) => {
  const [addressError, setAddressError] = useState<boolean>();
  const [addressInfos, setAddressInfos] = useState<AddressInfo>();
  const [address, setAddress] = useState(inputAddress);

  const web3Provider = useWeb3Provider();

  useEffect(() => {
    if (!addressInfos) {
      return;
    }
    onChange(addressInfos);
  }, [addressInfos]);

  const addressAvatar = (LSP3JSON: LSP3Profile, address: string): string => {
    if (LSP3JSON.LSP3Profile?.profileImage[0]?.url) {
      const LSP3ProfileImage = LSP3JSON.LSP3Profile.profileImage[0].url;
      if (LSP3ProfileImage.includes('ipfs://')) {
        return `${IPFS_GATEWAY_BASE_URL}${
          LSP3ProfileImage.split('ipfs://')[1]
        }`;
      }

      return LSP3JSON?.LSP3Profile?.profileImage[0].url;
    }
    return identicon(address);
  };

  const checkIsUP = async (address: string) => {
    const erc725 = new ERC725(
      erc725Schema as ERC725JSONSchema[],
      address,
      web3Provider,
      config,
    );
    try {
      const LSP3Profile = await erc725.fetchData(['LSP3Profile']);
      const formattedLSP3 = validateLSP3(LSP3Profile[0].value);
      setAddressInfos({
        address,
        isUniversalProfile: true,
        LSP3JSON: formattedLSP3,
      });
    } catch (error) {
      console.log(error);
      setAddressInfos({
        address,
        isUniversalProfile: false,
      });
    }
  };

  const fetchAddressInfo = (address: string) => {
    setAddressError(false);
    if (!ethers.utils.isAddress(address)) {
      setAddressError(true);
      return;
    }
    checkIsUP(address);
  };

  const renderUPInfos = (addressInfos: AddressInfo) => (
    <div>
      <h1>{addressInfos?.LSP3JSON?.LSP3Profile.name}</h1>
      <img
        src={addressAvatar(
          addressInfos.LSP3JSON as LSP3Profile, //checked before render
          addressInfos.address,
        )}
        alt="UP Profile Image"
      />
    </div>
  );

  return (
    <div className="py-8">
      <input
        onChange={(e) => {
          fetchAddressInfo(e.target.value);
          setAddress(e.target.value);
        }}
        value={address}
        type="text"
        placeholder="Enter an address"
        spellCheck="false"
        className="bg-darkGray focus:outline-none text-gray-400 focus:shadow-outline  py-2 px-4 block w-[450px] appearance-none leading-normal"
      />
      {addressError && <div className="text-red-500">Invalid address</div>}
      {addressInfos?.LSP3JSON ? (
        renderUPInfos(addressInfos)
      ) : (
        <div className="text-orange-500">
          Address is not a Universal Profile
        </div>
      )}
    </div>
  );
};

export default AddressInput;
