import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import LSP8Card from './LSP8Card';

const LSP8Table = () => {
  const { lsp8Assets } = useContext(AssetsContext);

  if (!lsp8Assets.length) {
    return <div> No NFTs yet</div>;
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
        {lsp8Assets.map((asset, index) => {
          return <LSP8Card key={`lsp8-${index}`} assetJSON={asset} />;
        })}
      </div>
    </>
  );
};

export default LSP8Table;
