import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { useTonConnectUI } from '@tonconnect/ui-react';

function App() {
  // State for loading UI when connecting/disconnecting
  const [isLoading, setIsLoading] = useState(false);

  // Hook to interact with Ton Connect UI
  const [tonConnectUI] = useTonConnectUI();

  // State to store connected wallet address
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);

  // State to check if wallet check has been performed
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle connection by saving address and updating state
  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log('Connected to wallet:', address);
    setIsLoaded(true);
  }, []);

  // Handle disconnection
  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log('Disconnected wallet');
    setIsLoaded(true);
  }, []);

  // Effect to check wallet status and subscribe to status changes
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    // Subscribe to wallet status changes
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  // Function to handle connect/disconnect actions
  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
      setIsLoading(false);
    } else {
      await tonConnectUI.openModal();
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Show loading screen while checking wallet status
  if (!isLoaded || isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          {isLoading ? 'Loading...' : 'Checking wallet...'}
        </div>
      </main>
    );
  }

  // Main UI
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Telegram Voting App</h1>
      {tonWalletAddress ? (
        <div className="flex flex-col items-center">
          <p className='bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 transition-colors duration-300'>Connected: {formatAddress(tonWalletAddress)}</p>
          <button
            onClick={handleWalletAction}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 transition-colors duration-300"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Connect Ton Wallet
        </button>
      )}
    </main>
  );
}

export default App;
