import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import LSP8Card from './LSP8Card';

const LSP8Table = () => {
  const { lsp8Assets } = useContext(AssetsContext);

  return (
    <>
      {!lsp8Assets.length ? <div> No NFT yet</div> : <div />}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {lsp8Assets.map((asset, index) => {
          return (
            <LSP8Card
              key={`lsp8-${index}`}
              image={asset.image}
              icon={asset.icon}
              tokenId={asset.tokenId}
              description={asset.description}
              collectionName={asset.collectionName}
              collectionDescription={asset.collectionDescription}
              collectionImage={asset.collectionImage}
              collectionIcon={asset.collectionIcon}
              collectionAddress={asset.collectionAddress}
            />
          );
        })}
      </div>
    </>
  );
};

export default LSP8Table;
