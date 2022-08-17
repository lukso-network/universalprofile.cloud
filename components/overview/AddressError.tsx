const AddressError: React.FC<{ message: string }> = ({ message }) => {
  return <div className="text-5xl flex mt-20 justify-center">{message}</div>;
};

export default AddressError;
