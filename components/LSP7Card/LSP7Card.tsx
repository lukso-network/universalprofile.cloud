interface Props {
  icon: string;
  amount: number;
  name: string;
  symbol: string;
}

const LSP7Card: React.FC<Props> = ({ icon, amount, name, symbol }) => {
  return (
    <div className="border border-darkGray p-3 rounded-lg h-[280px] mt-8">
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
        {/* if amount = 0 it means that this is an issued asset so we dont display the balance */}
        {amount != 0 && (
          <div className="text-xs leading-6">{amount} tokens</div>
        )}
      </div>
    </div>
  );
};

export default LSP7Card;
