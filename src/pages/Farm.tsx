import React, { useEffect, useState } from 'react';
import { useAlpaca } from '../context/AlpacaContext';
import LandCard from '../components/LandCard';
import { Tractor, Leaf, Scissors, Coins } from 'lucide-react';

const Farm: React.FC = () => {
  const { account, connectWallet, lands, loadLands, resources, buyLandPlot, convertCropsToSeeds, buySeeds, sellWool, loading } = useAlpaca();
  const [landName, setLandName] = useState('');
  const [seedAmount, setSeedAmount] = useState(1);
  const [cropAmount, setCropAmount] = useState(1);
  const [woolAmount, setWoolAmount] = useState(1);
  const [activeTab, setActiveTab] = useState('lands');
  
  useEffect(() => {
    if (account) {
      loadLands();
    }
  }, [account]);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to access your farm and manage your lands.
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

  const handleBuyLand = (e: React.FormEvent) => {
    e.preventDefault();
    if (landName.trim()) {
      buyLandPlot(landName);
      setLandName('');
    }
  };
  
  const handleConvertCrops = (e: React.FormEvent) => {
    e.preventDefault();
    if (cropAmount > 0 && cropAmount <= resources.crops) {
      convertCropsToSeeds(cropAmount);
    }
  };
  
  const handleBuySeeds = (e: React.FormEvent) => {
    e.preventDefault();
    if (seedAmount > 0) {
      buySeeds(seedAmount);
    }
  };
  
  const handleSellWool = (e: React.FormEvent) => {
    e.preventDefault();
    if (woolAmount > 0 && woolAmount <= resources.wool) {
      sellWool(woolAmount);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Farm</h1>
      <p className="text-gray-600 mb-6">Manage your lands, crops, and resources.</p>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Resources</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-3 rounded-md flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Scissors size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wool</p>
              <p className="text-2xl font-bold text-gray-800">{resources.wool}</p>
            </div>
          </div>
          <div className="bg-amber-50 p-3 rounded-md flex items-center">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <Leaf size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Seeds</p>
              <p className="text-2xl font-bold text-gray-800">{resources.seeds}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-md flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Tractor size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Crops</p>
              <p className="text-2xl font-bold text-gray-800">{resources.crops}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('lands')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'lands'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Lands
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'market'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resource Market
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'lands' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Land Plots</h2>
            <form onSubmit={handleBuyLand} className="flex">
              <input
                type="text"
                value={landName}
                onChange={(e) => setLandName(e.target.value)}
                placeholder="New land name"
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 flex items-center"
              >
                <Coins size={16} className="mr-1" />
                Buy Land (0.05 ETH)
              </button>
            </form>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading your lands...</p>
            </div>
          ) : lands.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Land Plots Yet</h2>
              <p className="text-gray-600 mb-6">
                You don't have any land plots yet. Buy your first land plot to start farming!
              </p>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Empty farmland" 
                  className="rounded-lg w-full max-w-md h-64 object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map(land => (
                <LandCard
                  key={land.id}
                  id={land.id}
                  name={land.name}
                  fertility={land.fertility}
                  size={land.size}
                  isPlanted={land.isPlanted}
                  plantedTime={land.plantedTime}
                  harvestTime={land.harvestTime}
                  cropType={land.cropType}
                  lastWatered={land.lastWatered}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 p-2 rounded-full mr-2">
                <Leaf size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Convert Crops to Seeds</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Convert your harvested crops into seeds for planting. 2 crops = 1 seed plus a bonus.
            </p>
            <form onSubmit={handleConvertCrops}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (max: {resources.crops})
                </label>
                <input
                  type="number"
                  min="1"
                  max={resources.crops}
                  value={cropAmount}
                  onChange={(e) => setCropAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={cropAmount <= 0 || cropAmount > resources.crops}
                className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Convert Crops
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 p-2 rounded-full mr-2">
                <Leaf size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Buy Seeds</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Purchase seeds to plant in your lands. Each seed costs 0.01 ETH.
            </p>
            <form onSubmit={handleBuySeeds}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={seedAmount}
                  onChange={(e) => setSeedAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={seedAmount <= 0}
                className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Seeds
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-full mr-2">
                <Scissors size={20} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Sell Wool</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sell your wool for ETH. Each wool is worth 0.005 ETH.
            </p>
            <form onSubmit={handleSellWool}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (max: {resources.wool})
                </label>
                <input
                  type="number"
                  min="1"
                  max={resources.wool}
                  value={woolAmount}
                  onChange={(e) => setWoolAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={woolAmount <= 0 || woolAmount > resources.wool}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Sell Wool
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farm;