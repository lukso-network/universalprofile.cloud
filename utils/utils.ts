export const firstTwoBytesOfAddress = (address: string) => {
  if (address) {
    return address.slice(2, 6);
  }
};
