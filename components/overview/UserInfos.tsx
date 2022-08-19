import identicon from 'ethereum-blockies-base64';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { useEffect, useState, useContext } from 'react';

import { Link, LSP3Profile } from '../../interfaces/lsps';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';

interface UserInfosProps {
  lsp3JSON: LSP3Profile | undefined;
}

const UserInfos: React.FC<UserInfosProps> = ({ lsp3JSON }) => {
  const [profile, setProfile] = useState<LSP3Profile>();

  const [avatar, setAvatar] = useState<string>();
  const [firstLink, setFirstLink] = useState<Link>();

  const { walletAddress } = useContext(WalletAddressContext);

  const userAvatar = (LSP3ProfileJSON: LSP3Profile): string => {
    if (LSP3ProfileJSON.LSP3Profile?.profileImage[0]?.url) {
      const LSP3ProfileImage = LSP3ProfileJSON.LSP3Profile.profileImage[0].url;
      if (LSP3ProfileImage.includes('ipfs://')) {
        return `${IPFS_GATEWAY_BASE_URL}${
          LSP3ProfileImage.split('ipfs://')[1]
        }`;
      }

      return LSP3ProfileJSON?.LSP3Profile?.profileImage[0].url;
    }
    return identicon(walletAddress);
  };
  const formatUPProfile = async () => {
    if (lsp3JSON) {
      setAvatar(userAvatar(lsp3JSON));
      setProfile(lsp3JSON);
      lsp3FirstLink();
    }
  };

  const addressFormatter = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const lsp3FirstLink = (): void => {
    if (lsp3JSON?.LSP3Profile.links[0]?.url) {
      setFirstLink(lsp3JSON.LSP3Profile.links[0]);
    }
  };

  useEffect(() => {
    console.log('changed address: ', walletAddress, lsp3JSON);
    if (lsp3JSON) {
      formatUPProfile();
      return;
    } else if (walletAddress) {
      setAvatar(identicon(walletAddress));
    } else {
      setAvatar(identicon('lukso'));
    }
    setProfile(undefined);
    setFirstLink(undefined);
  }, [lsp3JSON, walletAddress]);

  return (
    <div>
      <div className="flex mt-8">
        <img
          src={avatar}
          className="rounded-lg w-[150px] h-[150px] object-cover"
          alt="profileImage"
        />
        <div className="ml-4">
          <div className="text-xs">{addressFormatter(walletAddress)}</div>
          <div className="text-2xl font-bold my-2">
            {profile?.LSP3Profile.name}
          </div>
          {/* <div className="text-s">{profile?.LSP3Profile.description}</div> */}
          <div className="h-[120px]">
            {firstLink && (
              <a
                href={firstLink.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500"
              >
                {firstLink.title}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfos;
