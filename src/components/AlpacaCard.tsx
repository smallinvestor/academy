import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scissors, Tractor } from 'lucide-react';
import { useAlpaca } from '../context/AlpacaContext';

interface AlpacaCardProps {
  id: number;
  name: string;
  dna: string;
  level: number;
  rarity: number;
  lastFed: number;
  lastGroomed: number;
  wool: number;
  lastSheared: number;
  happiness: number;
  energy: number;
  farmingSkill: number;
}

const AlpacaCard: React.FC<AlpacaCardProps> = ({
  id,
  name,
  dna,
  level,
  rarity,
  lastFed,
  lastGroomed,
  wool,
  lastSheared,
  happiness,
  energy,
  farmingSkill
}) => {
  const { feedAlpaca, groomAlpaca, shearAlpaca } = useAlpaca();
  
  // Generate alpaca color based on DNA
  const generateColor = () => {
    const hue = parseInt(dna.substring(0, 6), 16) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate alpaca pattern based on DNA
  const generatePattern = () => {
    const patternValue = parseInt(dna.substring(6, 10), 16) % 5;
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
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  // Check if alpaca needs feeding/grooming/shearing
  const needsFeeding = Math.floor(Date.now() / 1000) - lastFed > 4 * 3600;
  const needsGrooming = Math.floor(Date.now() / 1000) - lastGroomed > 12 * 3600;
  const canBeSheared = Math.floor(Date.now() / 1000) - lastSheared > 3 * 86400; // 3 days
  
  // Get rarity color
  const getRarityColor = () => {
    if (rarity >= 90) return 'text-purple-600';
    if (rarity >= 70) return 'text-blue-600';
    if (rarity >= 50) return 'text-green-600';
    if (rarity >= 30) return 'text-yellow-600';
    return 'text-gray-600';
  };
  
  // Get rarity label
  const getRarityLabel = () => {
    if (rarity >= 90) return 'Legendary';
    if (rarity >= 70) return 'Epic';
    if (rarity >= 50) return 'Rare';
    if (rarity >= 30) return 'Uncommon';
    return 'Common';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div 
        className="h-48 flex items-center justify-center" 
        style={{ 
          backgroundColor: generateColor(),
          backgroundImage: generatePattern(),
          backgroundSize: '20px 20px'
        }}
      >
        <div className="relative w-32 h-32">
          {/* This would be replaced with actual alpaca SVG generated from DNA */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🦙</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <span className={`text-sm font-medium ${getRarityColor()}`}>
            {getRarityLabel()}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Level {level}</span>
            <span>Rarity: {rarity}/100</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${level}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500">Happiness:</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${happiness}%` }}
                ></div>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Energy:</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full" 
                  style={{ width: `${energy}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Tractor size={12} className="mr-1 text-blue-500" />
            <span>Farming Skill: {farmingSkill}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Fed: {getTimeSince(lastFed)}</span>
          <span>Groomed: {getTimeSince(lastGroomed)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => feedAlpaca(id)}
            disabled={!needsFeeding}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              needsFeeding
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Heart size={14} className="mr-1" />
            Feed
          </button>
          
          <button
            onClick={() => groomAlpaca(id)}
            disabled={!needsGrooming}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              needsGrooming
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Groom
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => shearAlpaca(id)}
            disabled={!canBeSheared}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              canBeSheared
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Scissors size={14} className="mr-1" />
            Shear Wool
          </button>
          
          <Link
            to={`/alpaca/${id}`}
            className="px-3 py-1 rounded text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlpacaCard;