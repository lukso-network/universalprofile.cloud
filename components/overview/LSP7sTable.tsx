import { useContext } from 'react';
import { AssetsContext } from '../../contexts/AssetsContext';
import LSP7Card from './LSP7Card';

const LSP7Table = () => {
  const { lsp7Assets } = useContext(AssetsContext);

  if (!lsp7Assets.length) {
    return <div> No token yet</div>;
  }

  return (
    <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
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
