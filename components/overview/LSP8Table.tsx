import { useContext, useEffect, useState } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import LSP8Card from './LSP8Card';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';

interface Props {
  addresses: string[];
  ownerAddress: string;
}

const LSP8Table: React.FC<Props> = ({ addresses, ownerAddress }) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(true);
  const { lsp8Assets, setLsp8Assets } = useContext(AssetsContext);

  useEffect(() => {
    if (!web3Provider || !addresses.length) {
      return;
    }

    const fetch = async () => {
      setLsp8Assets([]);
      setIsLoading(true);

      //fetchLSP8
      await Promise.all(
        addresses.map(async (assetAddress) => {
          const lsp8Assets = await fetchLSP8Assets(
            assetAddress,
            ownerAddress,
            web3Provider,
          );
          if (lsp8Assets instanceof Object) {
            setLsp8Assets((prev) => [...prev, ...lsp8Assets]);
          }
        }),
      );

      setIsLoading(false);
    };
    fetch();
  }, [web3Provider, addresses]);

  if (!lsp8Assets.length && !isLoading) {
    return <div>No NFTs yet</div>;
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
        {isLoading
          ? 'Loading NFTs metadata...'
          : lsp8Assets.map((asset, index) => {
              return <LSP8Card key={`lsp8-${index}`} assetJSON={asset} />;
            })}
      </div>
    </>
  );
};

export default LSP8Table;
