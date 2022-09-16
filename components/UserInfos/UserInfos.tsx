import identicon from 'ethereum-blockies-base64';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { useEffect, useState } from 'react';
import { Link, LSP3Profile } from '../../interfaces/lsps';
import { firstTwoBytesOfAddress } from '../../utils/utils';

interface Props {
  lsp3JSON: LSP3Profile | undefined;
  address: string;
  address: string;
}

const UserInfos: React.FC<UserInfosProps> = ({ lsp3JSON, address }) => {
  const [profile, setProfile] = useState<LSP3Profile>();

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

  const lsp3FirstLink = (): void => {
    if (lsp3JSON?.LSP3Profile.links[0]?.url) {
      setFirstLink(lsp3JSON.LSP3Profile.links[0]);
    }
  };

  const UPName = (): JSX.Element => {
    if (profile?.LSP3Profile.name) {
      return (
        <>
          <span>{profile?.LSP3Profile.name}</span>
          <span className="text-sm ml-2 text-gray-400">
            #{firstTwoBytesOfAddress(address)}
          </span>
        </>
      );
    }
    return <span>Anonymous</span>;
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

  return (
    <div>
      <div className="flex mt-8">
        <img
          src={avatar}
          className="rounded-lg w-[150px] h-[150px] object-cover"
          alt="profileImage"
        />
        <div className="ml-4">
          <a
            href={`https://l16.universalprofile.cloud/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-2xl font-bold my-2">{UPName()}</div>
          </a>
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
