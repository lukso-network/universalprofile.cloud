interface LSP8CardProps {
  assetJSON: {
    icon: string;
    image: string;
    tokenId: string;
    description: string;
    collectionName: string;
    collectionDescription: string;
    collectionImage: string;
    collectionIcon: string;
    collectionAddress: string;
  };
}

const LSP8Card: React.FC<LSP8CardProps> = ({ assetJSON }) => {
  return (
    <div className="border border-darkGray p-3 rounded-lg h-[280px] mt-8">
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={assetJSON.image}
          alt="nft-image"
          className="object-none rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div className="text-xs font-bold text-gray-600 leading-6">
        {assetJSON.collectionName}
      </div>
      <div className="text-sm leading-6">#{parseInt(assetJSON.tokenId)}</div>
    </div>
  );
};

export default LSP8Card;
