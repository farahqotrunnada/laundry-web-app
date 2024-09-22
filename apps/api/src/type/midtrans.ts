export const midtransStatus = [
  'capture',
  'settlement',
  'pending',
  'deny',
  'cancel',
  'expire',
  'failure',
  'refund',
  'partial_refund',
  'authorize',
] as const;

export type MidtransStatus = (typeof midtransStatus)[number];
