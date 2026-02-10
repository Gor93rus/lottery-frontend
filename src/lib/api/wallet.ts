import { getTonBalance } from '../../services/tonService';

export async function getWalletBalance(address: string) {
  const balance = await getTonBalance(address);
  return { balance };
}
