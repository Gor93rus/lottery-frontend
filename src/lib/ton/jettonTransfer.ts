import { beginCell, Address, toNano, Cell } from '@ton/core';

// Jetton transfer operation code
const JETTON_TRANSFER_OP = 0x0f8a7ea5;

/**
 * Create a Jetton transfer message
 * @param jettonAmount - Amount in Jetton units (bigint)
 * @param toAddress - Destination TON address (lottery wallet)
 * @param responseAddress - User's address for excess TON return
 * @param forwardTonAmount - TON amount for forward notification (default 0.05 TON)
 * @returns Cell containing the Jetton transfer message
 */
export function createJettonTransferMessage(
  jettonAmount: bigint,
  toAddress: string,
  responseAddress: string,
  forwardTonAmount: bigint = toNano('0.05')
): Cell {
  const body = beginCell()
    .storeUint(JETTON_TRANSFER_OP, 32)  // op code for jetton_transfer
    .storeUint(0, 64)                    // query_id
    .storeCoins(jettonAmount)            // amount
    .storeAddress(Address.parse(toAddress))  // destination
    .storeAddress(Address.parse(responseAddress))  // response_destination
    .storeBit(false)                     // no custom_payload
    .storeCoins(forwardTonAmount)        // forward_ton_amount
    .storeBit(false);                    // no forward_payload

  return body.endCell();
}

/**
 * Helper to create Jetton transfer transaction for TON Connect
 * @param jettonWalletAddress - User's Jetton wallet address
 * @param jettonAmount - Amount in Jetton units
 * @param destinationAddress - Lottery TON wallet address
 * @param responseAddress - User's address for excess return
 * @param gasAmount - TON amount for gas (default 0.1 TON)
 * @param forwardTonAmount - TON for forward notification (default 0.05 TON)
 * @returns Transaction object ready for TON Connect
 */
export function createJettonTransferTransaction(
  jettonWalletAddress: string,
  jettonAmount: bigint,
  destinationAddress: string,
  responseAddress: string,
  gasAmount: bigint = toNano('0.1'),
  forwardTonAmount: bigint = toNano('0.05')
) {
  const body = createJettonTransferMessage(
    jettonAmount,
    destinationAddress,
    responseAddress,
    forwardTonAmount
  );

  return {
    validUntil: Math.floor(Date.now() / 1000) + 360, // 6 minutes
    messages: [
      {
        address: jettonWalletAddress,  // Send to user's Jetton Wallet!
        amount: gasAmount.toString(),  // TON for gas
        payload: body.toBoc().toString('base64')
      }
    ]
  };
}
