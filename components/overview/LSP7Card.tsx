import NextImage from 'next/image';

interface LSP7CardProps {
  icon: string;
  amount: number;
  name: string;
  symbol: string;
}

const LSP7Card: React.FC<LSP7CardProps> = ({ icon, amount, name, symbol }) => {
  return (
    <div className="border border-darkGray p-3 rounded-lg  h-[280px]">
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={icon}
          alt="nft-image"
          className="object-none rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div>
        <div className="text-sm font-bold text-gray-600 leading-6">{name}</div>
        <div className="leading-6">{symbol}</div>
        <div className="text-xs leading-6">{amount} tokens</div>
      </div>
    </div>
  );
};

export default LSP7Card;
