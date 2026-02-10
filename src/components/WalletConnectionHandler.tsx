import { useEffect, useRef } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component that watches for TON wallet connections and automatically binds
 * the Telegram profile to the wallet when a connection is made.
 */
export function WalletConnectionHandler() {
  const walletAddress = useTonAddress();
  const { user, connectWallet, isAuthenticated } = useAuth();
  const lastAddressRef = useRef<string | null>(null);
  const bindingRef = useRef<boolean>(false);

  useEffect(() => {
    const bindWalletToProfile = async () => {
      // Only proceed if:
      // 1. User is authenticated (logged in via Telegram)
      // 2. A wallet is connected
      // 3. The wallet address changed (new connection)
      // 4. The user doesn't already have this wallet saved
      // 5. We're not already in the process of binding
      if (
        isAuthenticated &&
        walletAddress &&
        walletAddress !== lastAddressRef.current &&
        user?.tonWallet !== walletAddress &&
        !bindingRef.current
      ) {
        try {
          bindingRef.current = true;
          console.log('Binding wallet to Telegram profile:', walletAddress);
          await connectWallet(walletAddress);
          lastAddressRef.current = walletAddress;
        } catch (error) {
          console.error('Failed to bind wallet to profile:', error);
        } finally {
          bindingRef.current = false;
        }
      } else if (!walletAddress) {
        // Reset when wallet is disconnected
        lastAddressRef.current = null;
      }
    };

    bindWalletToProfile();
  }, [walletAddress, user?.tonWallet, isAuthenticated, connectWallet]);

  // This component doesn't render anything
  return null;
}
