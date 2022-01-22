export const parseBool = (value: string) =>
  ['true', '1'].some((v) => v === value.toLowerCase());
