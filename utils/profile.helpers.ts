export const getOriginalPrivateId = (privateId: string) =>
  Number(privateId) - 2040;

export const add2040ToProfileDetailsId = (privateId: number) => {
  return Number(privateId) + 2040;
};
