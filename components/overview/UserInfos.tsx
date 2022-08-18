import identicon from 'ethereum-blockies-base64';

const UserInfos = ({ userAddress }: { userAddress: string }) => {
  //format address string
  const formattedAddress =
    userAddress?.slice(0, 6) + '...' + userAddress?.slice(-4);
  return (
    <div className="flex my-6">
      <img className="rounded-xl mr-6 h-24" src={identicon(userAddress)} />
      <div className="">{formattedAddress}</div>
    </div>
  );
};

export default UserInfos;
