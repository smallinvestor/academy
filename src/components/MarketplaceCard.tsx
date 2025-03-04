import React from 'react';
import { useWizard } from '../context/WizardContext';
import { Sparkles, Wand2 } from 'lucide-react';

interface MarketplaceCardProps {
  tokenId: number;
  seller: string;
  price: string;
  name: string;
  level: number;
  rarity: number;
  dna: string;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  tokenId,
  seller,
  price,
  name,
  level,
  rarity,
  dna
}) => {
  const { account, buyWizard, cancelListing } = useWizard();
  
  // Generate wizard color based on DNA
  const generateColor = () => {
    const hue = parseInt(dna.substring(0, 6), 16) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate wizard pattern based on DNA
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
  
  // Get wizard element based on DNA
  const getWizardElement = () => {
    const elementValue = parseInt(dna.substring(10, 12), 16) % 5;
    switch(elementValue) {
      case 0: return { name: 'Fire', emoji: '🔥', color: 'text-red-500' };
      case 1: return { name: 'Water', emoji: '💧', color: 'text-blue-500' };
      case 2: return { name: 'Earth', emoji: '🌱', color: 'text-green-500' };
      case 3: return { name: 'Air', emoji: '💨', color: 'text-gray-400' };
      case 4: return { name: 'Arcane', emoji: '✨', color: 'text-purple-500' };
      default: return { name: 'Unknown', emoji: '❓', color: 'text-gray-500' };
    }
  };
  
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
  
  // Check if current user is the seller
  const isOwner = account && account.toLowerCase() === seller.toLowerCase();
  
  const element = getWizardElement();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-48 flex items-center justify-center" 
        style={{ 
          backgroundColor: generateColor(),
          backgroundImage: generatePattern(),
          backgroundSize: '20px 20px'
        }}
      >
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🧙</span>
          </div>
          <div className="absolute bottom-0 right-0">
            <span className="text-2xl">{element.emoji}</span>
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
            <span className={element.color}>{element.name} Wizard</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Sparkles size={12} className="mr-1 text-purple-500" />
            <span>Magical Affinity: {parseInt(dna.substring(12, 14), 16) % 100}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-indigo-600">{price} ETH</div>
          <div className="text-xs text-gray-500">
            Seller: {`${seller.substring(0, 6)}...${seller.substring(seller.length - 4)}`}
          </div>
        </div>
        
        {isOwner ? (
          <button
            onClick={() => cancelListing(tokenId)}
            className="w-full py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Cancel Listing
          </button>
        ) : (
          <button
            onClick={() => buyWizard(tokenId, price)}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Wand2 size={18} className="mr-2" />
            Acquire Wizard
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketplaceCard;