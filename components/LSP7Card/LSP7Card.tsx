import identicon from 'ethereum-blockies-base64';
import { useState } from 'react';

interface Props {
  icon: string;
  amount: number;
  name: string;
  symbol: string;
  address: string;
}

const LSP7Card: React.FC<Props> = ({ icon, amount, name, symbol, address }) => {
  const [showSendBtn, setShowSendBtn] = useState(false);

  return (
    <div
      className={`border hover:scale-105 relative border-gray-300 rounded-xl h-[280px] overflow-hidden mt-8`}
      onMouseEnter={() => setShowSendBtn(true)}
      onMouseLeave={() => setShowSendBtn(false)}
    >
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={icon}
          alt="nft-image"
          className="object-cover rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div className="px-3">
        <div className="font-ibmpBold text-gray-600 leading-6">{name}</div>
        <div className="leading-6">{symbol}</div>
        {/* if amount = 0 it means that this is an issued asset so we dont display the balance */}
        {amount != 0 && (
          <div className="text-xs leading-6">{amount} tokens</div>
        )}
        <div className="absolute bottom-[-30%] right-[-30%] rotate-45">
          <img src={identicon(address)} alt="address identicon" />
        </div>
      </div>
      {showSendBtn && (
        <div className="absolute z-1 top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center justify-center">
          <button className="px-3 py-2 font-bold bg-deepPink rounded text-white">
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default LSP7Card;
