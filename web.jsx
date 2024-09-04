import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from '@/components/ui/alert';

const UniswapFrontend = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [amount, setAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        setError(err.message);
      }
    };
    initWeb3();
  }, []);

  const handleSwap = async () => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x...',
        ['function swap(address _tokenIn, address _tokenOut, uint256 _amountIn, uint256 _amountOutMin, address _to) external returns (uint256 amount)'],
        signer
      );
      const tx = await contract.swap(
        token1,
        token2,
        ethers.utils.parseEther(amount.toString()),
        0,
        account
      );
      await tx.wait();
      setToken1('');
      setToken2('');
      setAmount(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateExchangeRate = async () => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x...',
        ['function getAmountOut(uint256 _amountIn, address _tokenIn, address _tokenOut) external view returns (uint256 amount)'],
        signer
      );
      const amountOut = await contract.getAmountOut(
        ethers.utils.parseEther(amount.toString()),
        token1,
        token2
      );
      const rate = ethers.utils.formatEther(amountOut);
      setExchangeRate(rate);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Uniswap Clone</h1>
        {error && (
          <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mb-4">
          <label htmlFor="token1" className="block text-sm font-medium text-gray-700">
            Token 1
          </label>
          <input
            type="text"
            id="token1"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={token1}
            onChange={(e) => setToken1(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="token2" className="block text-sm font-medium text-gray-700">
            Token 2
          </label>
          <input
            type="text"
            id="token2"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={token2}
            onChange={(e) => setToken2(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={calculateExchangeRate}
          >
            Calculate Exchange Rate
          </button>
        </div>
        {exchangeRate > 0 && (
          <div className="mb-4">
            <p>Exchange Rate: {exchangeRate} ETH</p>
          </div>
        )}
        <div className="mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSwap}
          >
            Swap
          </button>
        </div>
        <div className="mb-4">
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default UniswapFrontend;