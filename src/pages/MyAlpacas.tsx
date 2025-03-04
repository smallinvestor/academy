import React, { useEffect } from 'react';
import { useAlpaca } from '../context/AlpacaContext';
import AlpacaCard from '../components/AlpacaCard';
import MintAlpacaForm from '../components/MintAlpacaForm';
import BreedingForm from '../components/BreedingForm';

const MyAlpacas: React.FC = () => {
  const { account, alpacas, loadAlpacas, connectWallet, loading } = useAlpaca();
  
  useEffect(() => {
    if (account) {
      loadAlpacas();
    }
  }, [account]);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to view your alpacas and start breeding.
        </p>
        <button 
          onClick={connectWallet}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Alpaca Collection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading your alpacas...</p>
            </div>
          ) : alpacas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Alpacas Yet</h2>
              <p className="text-gray-600 mb-6">
                You don't have any alpacas yet. Mint your first alpaca for free to start your collection!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alpacas.map(alpaca => (
                <AlpacaCard
                  key={alpaca.id}
                  id={alpaca.id}
                  name={alpaca.name}
                  dna={alpaca.dna}
                  level={alpaca.level}
                  rarity={alpaca.rarity}
                  lastFed={alpaca.lastFed}
                  lastGroomed={alpaca.lastGroomed}
                  wool={alpaca.wool}
                  lastSheared={alpaca.lastSheared}
                  happiness={alpaca.happiness}
                  energy={alpaca.energy}
                  farmingSkill={alpaca.farmingSkill}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <MintAlpacaForm />
          <BreedingForm />
        </div>
      </div>
    </div>
  );
};

export default MyAlpacas;