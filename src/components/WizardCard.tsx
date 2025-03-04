import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, BookOpen, Sparkles } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

interface WizardCardProps {
  id: number;
  name: string;
  dna: string;
  level: number;
  rarity: number;
  lastTrained: number;
  lastMeditated: number;
  mana: number;
  lastHarvested: number;
  wisdom: number;
  energy: number;
  spellPower: number;
}

const WizardCard: React.FC<WizardCardProps> = ({
  id,
  name,
  dna,
  level,
  rarity,
  lastTrained,
  lastMeditated,
  mana,
  lastHarvested,
  wisdom,
  energy,
  spellPower
}) => {
  const { trainWizard, meditateWizard, harvestMana } = useWizard();
  
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
  
  // Calculate time since last trained/meditated/harvested
  const getTimeSince = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestamp;
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  // Check if wizard needs training/meditation/mana harvesting
  const needsTraining = Math.floor(Date.now() / 1000) - lastTrained > 4 * 3600;
  const needsMeditation = Math.floor(Date.now() / 1000) - lastMeditated > 12 * 3600;
  const canHarvestMana = Math.floor(Date.now() / 1000) - lastHarvested > 3 * 86400; // 3 days
  
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

  const element = getWizardElement();

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
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${level}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500">Wisdom:</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${wisdom}%` }}
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
            <Sparkles size={12} className="mr-1 text-purple-500" />
            <span>Spell Power: {spellPower}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Trained: {getTimeSince(lastTrained)}</span>
          <span>Meditated: {getTimeSince(lastMeditated)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => trainWizard(id)}
            disabled={!needsTraining}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              needsTraining
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Wand2 size={14} className="mr-1" />
            Train
          </button>
          
          <button
            onClick={() => meditateWizard(id)}
            disabled={!needsMeditation}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              needsMeditation
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <BookOpen size={14} className="mr-1" />
            Meditate
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => harvestMana(id)}
            disabled={!canHarvestMana}
            className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
              canHarvestMana
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles size={14} className="mr-1" />
            Harvest Mana
          </button>
          
          <Link
            to={`/wizard/${id}`}
            className="px-3 py-1 rounded text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WizardCard;