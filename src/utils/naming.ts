export const getNextDefaultName = (prefix: string, existingNames: string[]): string => {
  let maxNumber = 0;
  const regex = new RegExp(`^${prefix} (\\d+)$`);
  for (const name of existingNames) {
    const match = name.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  }
  return `${prefix} ${maxNumber + 1}`;
};
