import { useContext, useEffect, useState } from 'react';

import { AssetsContext } from '../../contexts/AssetsContext';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import LSP7Card from './LSP7Card';

interface Props {
  addresses: string[];
  ownerAddress: string;
}

const LSP7Table: React.FC<Props> = ({ addresses, ownerAddress }) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(true);

  const { lsp7Assets, setLsp7Assets } = useContext(AssetsContext);

  useEffect(() => {
    if (!web3Provider || !addresses.length) {
      return;
    }

    const fetch = async () => {
      console.log('fetching lsp7 assets');
      setLsp7Assets([]);
      setIsLoading(true);
      // fetch LSP7 assets
      await Promise.all(
        addresses.map(async (assetAddress) => {
          const lsp7Assets = await fetchLSP7Assets(
            assetAddress,
            ownerAddress,
            web3Provider,
          );
          if (lsp7Assets instanceof Object) {
            setLsp7Assets((prev) => [...prev, lsp7Assets]);
          }
        }),
      );
      setIsLoading(false);
    };
    fetch();
  }, [web3Provider, addresses]);

  if (!lsp7Assets.length && !isLoading) {
    return <div>No token yet</div>;
  }

  return (
    <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
      {isLoading
        ? 'Loading tokens metadata...'
        : lsp7Assets.map((asset, index) => {
            return (
              <LSP7Card
                key={`lsp7-${index}`}
                icon={asset.icon}
                amount={asset.amount}
                name={asset.name}
                symbol={asset.symbol}
              />
            );
          })}
      {!isLoading && lsp7Assets.length === 0 && <div>No token yet</div>}
    </div>
  );
};

export default LSP7Table;
