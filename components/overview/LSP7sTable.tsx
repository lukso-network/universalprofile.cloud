import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import LSP7Card from './LSP7Card';

const LSP7Table = () => {
  const { lsp7Assets } = useContext(AssetsContext);

  if (!lsp7Assets.length) {
    return <div> No token yet</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4 mt-8 mt-8">
      {lsp7Assets.map((asset, index) => {
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
    </div>
  );
};

export default LSP7Table;
