import identicon from 'ethereum-blockies-base64';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Link, LSP3Profile } from '../../interfaces/lsps';
import firstTwoBytesOfAddress from '../../utils/firstTwoBytesOfAddress';

interface UserInfosProps {
  lsp3JSON: LSP3Profile | undefined;
}

const UserInfos: React.FC<UserInfosProps> = ({ lsp3JSON }) => {
  const [profile, setProfile] = useState<LSP3Profile>();
  const [address, setAddress] = useState<string>('');
  const router = useRouter();

  const [avatar, setAvatar] = useState<string>();
  const [firstLink, setFirstLink] = useState<Link>();

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
    return identicon(address);
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

  const UPName = (): JSX.Element => {
    if (profile?.LSP3Profile.name) {
      return (
        <>
          <span>LSP3ProfileJSON.LSP3Profile.name;</span>
          <span className="text-sm ml-2 text-gray-400">
            #{firstTwoBytesOfAddress(address)}
          </span>
        </>
      );
    }
    return <>Anonymous</>;
  };

  useEffect(() => {
    if (lsp3JSON?.LSP3Profile.name) {
      formatUPProfile();
      return;
    } else if (address) {
      setAvatar(identicon(address));
    } else {
      setAvatar(identicon('lukso'));
    }
    setProfile(undefined);
    setFirstLink(undefined);
  }, [lsp3JSON, address]);

  useEffect(() => {
    if (router.query.address) {
      setAddress(addressFormatter(router.query.address as string));
    }
  }, [router]);

  return (
    <div>
      <div className="flex mt-8">
        <img
          src={avatar}
          className="rounded-lg w-[150px] h-[150px] object-cover"
          alt="profileImage"
        />
        <div className="ml-4">
          {/* <div className="text-xs">{addressFormatter(address)}</div> */}
          <div className="text-2xl font-bold my-2">{UPName()}</div>
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
