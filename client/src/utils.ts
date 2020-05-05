export const indexToHue = (index: number, lineLength: number) => {
  const lineLengthClamp = Math.max(6, lineLength);
  return (360 * index) / lineLengthClamp;
};
