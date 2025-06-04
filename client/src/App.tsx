import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { useTonConnectUI } from '@tonconnect/ui-react';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    setIsRegistered(false); // Assume not registered until we check
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    setIsRegistered(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleRegister = async () => {
    if (!tonWalletAddress || !username || !profilePic) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('walletAddress', tonWalletAddress);
    formData.append('username', username);
    formData.append('profilePic', profilePic);

    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      setIsRegistered(true);
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Ton Voting App</h1>
      {tonWalletAddress ? (
        <>
          <p>Connected: {formatAddress(tonWalletAddress)}</p>

          {!isRegistered && (
            <div className="flex flex-col items-center mt-4">
              <input
                type="text"
                placeholder="Enter username"
                className="mb-2 px-2 py-1 border"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="mb-2"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              />
              <button
                onClick={handleRegister}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
              >
                Register
              </button>
            </div>
          )}

          <button
            onClick={async () => await tonConnectUI.disconnect()}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
          >
            Disconnect Wallet
          </button>
        </>
      ) : (
        <button
          onClick={async () => await tonConnectUI.openModal()}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Connect Ton Wallet
        </button>
      )}
    </main>
  );
}

export default App;
