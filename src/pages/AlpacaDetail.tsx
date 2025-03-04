import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Scissors, DollarSign } from 'lucide-react';
import { useAlpaca } from '../context/AlpacaContext';

const AlpacaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { alpacas, feedAlpaca, groomAlpaca, shearAlpaca, listAlpaca } = useAlpaca();
  const [price, setPrice] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  
  const alpacaId = parseInt(id || '0');
  const alpaca = alpacas.find(a => a.id === alpacaId);
  
  useEffect(() => {
    // Reset form when alpaca changes
    setShowListingForm(false);
    setPrice('');
  }, [alpacaId]);
  
  if (!alpaca) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Alpaca not found or still loading...</p>
        <Link to="/my-alpacas" className="text-indigo-600 hover:underline">
          Back to My Alpacas
        </Link>
      </div>
    );
  }
  
  // Generate alpaca color based on DNA
  const generateColor = () => {
    const hue = parseInt(alpaca.dna.substring(0, 6), 16) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate alpaca pattern based on DNA
  const generatePattern = () => {
    const patternValue = parseInt(alpaca.dna.substring(6, 10), 16) % 5;
    switch(patternValue) {
      case 0: return 'linear-gradient(45deg, transparent 0%, transparent 100%)';
      case 1: return 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)';
      case 2: return 'radial-gradient(circle, rgba(255,255,255,0.1) 20%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 80%)';
      case 3: return 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 100%)';
      case 4: return 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 10%, transparent 10%, transparent 20%)';
      default: return 'none';
    }
  };
  
  // Calculate time since last fed/groomed/sheared
  const getTimeSince = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestamp;
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Check if alpaca needs feeding/grooming/shearing
  const needsFeeding = Math.floor(Date.now() / 1000) - alpaca.lastFed > 4 * 3600;
  const needsGrooming = Math.floor(Date.now() / 1000) - alpaca.lastGroomed > 12 * 3600;
  const canBeSheared = Math.floor(Date.now() / 1000) - alpaca.lastSheared > 3 * 86400; // 3 days
  
  // Get rarity label
  const getRarityLabel = () => {
    if (alpaca.rarity >= 90) return 'Legendary';
    if (alpaca.rarity >= 70) return 'Epic';
    if (alpaca.rarity >= 50) return 'Rare';
    if (alpaca.rarity >= 30) return 'Uncommon';
    return 'Common';
  };
  
  // Handle listing form submission
  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price && parseFloat(price) > 0) {
      listAlpaca(alpacaId, price);
    }
  };

  return (
    <div>
      <Link to="/my-alpacas" className="inline-flex items-center text-indigo-600 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to My Alpacas
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="h-64 flex items-center justify-center" 
          style={{ 
            backgroundColor: generateColor(),
            backgroundImage: generatePattern(),
            backgroundSize: '20px 20px'
          }}
        >
          <div className="relative w-48 h-48">
            {/* This would be replaced with actual alpaca SVG generated from DNA */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🦙</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{alpaca.name}</h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {getRarityLabel()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Stats</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Level</span>
                    <span>{alpaca.level}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${alpaca.level}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Rarity</span>
                    <span>{alpaca.rarity}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${alpaca.rarity}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Happiness</span>
                    <span>{alpaca.happiness}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${alpaca.happiness}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Energy</span>
                    <span>{alpaca.energy}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${alpaca.energy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Farming Skill</span>
                    <span>{alpaca.farmingSkill}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ width: `${alpaca.farmingSkill}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Care</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Fed:</span>
                  <span className={needsFeeding ? 'text-red-600' : 'text-green-600'}>
                    {getTimeSince(alpaca.lastFed)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Groomed:</span>
                  <span className={needsGrooming ? 'text-red-600' : 'text-green-600'}>
                    {getTimeSince(alpaca.lastGroomed)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sheared:</span>
                  <span className={canBeSheared ? 'text-green-600' : 'text-gray-600'}>
                    {getTimeSince(alpaca.lastSheared)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Breeding Cooldown:</span>
                  <span>
                    {alpaca.breedingCooldown > Math.floor(Date.now() / 1000) 
                      ? `Ready in ${Math.ceil((alpaca.breedingCooldown - Math.floor(Date.now() / 1000)) / 3600)} hours` 
                      : 'Ready to breed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">DNA</h2>
            <p className="font-mono text-sm bg-gray-100 p-3 rounded overflow-x-auto">
              {alpaca.dna}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => feedAlpaca(alpacaId)}
              disabled={!needsFeeding}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                needsFeeding
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Heart size={18} className="mr-2" />
              Feed Alpaca
            </button>
            
            <button
              onClick={() => groomAlpaca(alpacaId)}
              disabled={!needsGrooming}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                needsGrooming
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Scissors size={18} className="mr-2" />
              Groom Alpaca
            </button>
            
            <button
              onClick={() => shearAlpaca(alpacaId)}
              disabled={!canBeSheared}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                canBeSheared
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Scissors size={18} className="mr-2" />
              Shear Wool
            </button>
            
            <button
              onClick={() => setShowListingForm(!showListingForm)}
              className="flex items-center justify-center py-2 px-4 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
              <DollarSign size={18} className="mr-2" />
              {showListingForm ? 'Cancel' : 'List for Sale'}
            </button>
          </div>
          
          {showListingForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-800 mb-3">List Alpaca for Sale</h3>
              <form onSubmit={handleListingSubmit}>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0.001"
                    step="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.1"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  List for Sale
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlpacaDetail;