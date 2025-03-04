import React, { useState } from 'react';
import { useAlpaca } from '../context/AlpacaContext';

const MintAlpacaForm: React.FC = () => {
  const [name, setName] = useState('');
  const { mintAlpaca, alpacas, loading } = useAlpaca();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await mintAlpaca(name);
      setName('');
    }
  };
  
  const isFirstAlpaca = alpacas.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mint a New Alpaca</h2>
      
      <p className="text-gray-600 mb-4">
        {isFirstAlpaca 
          ? "Mint your first alpaca for FREE! Name your alpaca and start your collection."
          : "Mint another alpaca for 0.05 ETH to expand your collection."}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Alpaca Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a name for your alpaca"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className={`w-full py-2 rounded-md ${
            loading || !name.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Minting...' : `Mint Alpaca ${!isFirstAlpaca ? '(0.05 ETH)' : '(Free)'}`}
        </button>
      </form>
    </div>
  );
};

export default MintAlpacaForm;