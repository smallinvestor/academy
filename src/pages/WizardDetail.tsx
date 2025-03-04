import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Wand2, Sparkles, DollarSign } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

const WizardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { wizards, trainWizard, meditateWizard, harvestMana, listWizard } = useWizard();
  const [price, setPrice] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  
  const wizardId = parseInt(id || '0');
  const wizard = wizards.find(w => w.id === wizardId);
  
  useEffect(() => {
    // Reset form when wizard changes
    setShowListingForm(false);
    setPrice('');
  }, [wizardId]);
  
  if (!wizard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Wizard not found or still loading...</p>
        <Link to="/my-wizards" className="text-indigo-600 hover:underline">
          Back to My Wizards
        </Link>
      </div>
    );
  }
  
  // Generate wizard color based on DNA
  const generateColor = () => {
    const hue = parseInt(wizard.dna.substring(0, 6), 16) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate wizard pattern based on DNA
  const generatePattern = () => {
    const patternValue = parseInt(wizard.dna.substring(6, 10), 16) % 5;
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
    const elementValue = parseInt(wizard.dna.substring(10, 12), 16) % 5;
    switch(elementValue) {
      case 0: return { name: 'Fire', emoji: '🔥', color: 'text-red-500', bgColor: 'bg-red-100' };
      case 1: return { name: 'Water', emoji: '💧', color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 2: return { name: 'Earth', emoji: '🌱', color: 'text-green-500', bgColor: 'bg-green-100' };
      case 3: return { name: 'Air', emoji: '💨', color: 'text-gray-400', bgColor: 'bg-gray-100' };
      case 4: return { name: 'Arcane', emoji: '✨', color: 'text-purple-500', bgColor: 'bg-purple-100' };
      default: return { name: 'Unknown', emoji: '❓', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };
  
  // Calculate time since last trained/meditated/harvested
  const getTimeSince = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestamp;
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Check if wizard needs training/meditation/mana harvesting
  const needsTraining = Math.floor(Date.now() / 1000) - wizard.lastTrained > 4 * 3600;
  const needsMeditation = Math.floor(Date.now() / 1000) - wizard.lastMeditated > 12 * 3600;
  const canHarvestMana = Math.floor(Date.now() / 1000) - wizard.lastHarvested > 3 * 86400; // 3 days
  
  // Get rarity label
  const getRarityLabel = () => {
    if (wizard.rarity >= 90) return 'Legendary';
    if (wizard.rarity >= 70) return 'Epic';
    if (wizard.rarity >= 50) return 'Rare';
    if (wizard.rarity >= 30) return 'Uncommon';
    return 'Common';
  };
  
  // Handle listing form submission
  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price && parseFloat(price) > 0) {
      listWizard(wizardId, price);
    }
  };

  const element = getWizardElement();

  return (
    <div>
      <Link to="/my-wizards" className="inline-flex items-center text-indigo-600 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to My Wizards
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🧙</span>
            </div>
            <div className="absolute bottom-0 right-0">
              <span className="text-4xl">{element.emoji}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{wizard.name}</h1>
            <div className="flex items-center">
              <span className={`px-3 py-1 ${element.bgColor} ${element.color} rounded-l-full text-sm font-medium`}>
                {element.name}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-r-full text-sm font-medium">
                {getRarityLabel()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Magical Stats</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Level</span>
                    <span>{wizard.level}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${wizard.level}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Rarity</span>
                    <span>{wizard.rarity}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${wizard.rarity}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Wisdom</span>
                    <span>{wizard.wisdom}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${wizard.wisdom}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Energy</span>
                    <span>{wizard.energy}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${wizard.energy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Spell Power</span>
                    <span>{wizard.spellPower}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${wizard.spellPower}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Magical Activities</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Trained:</span>
                  <span className={needsTraining ? 'text-red-600' : 'text-green-600'}>
                    {getTimeSince(wizard.lastTrained)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Meditated:</span>
                  <span className={needsMeditation ? 'text-red-600' : 'text-green-600'}>
                    {getTimeSince(wizard.lastMeditated)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Mana Harvest:</span>
                  <span className={canHarvestMana ? 'text-green-600' : 'text-gray-600'}>
                    {getTimeSince(wizard.lastHarvested)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Breeding Cooldown:</span>
                  <span>
                    {wizard.breedingCooldown > Math.floor(Date.now() / 1000) 
                      ? `Ready in ${Math.ceil((wizard.breedingCooldown - Math.floor(Date.now() / 1000)) / 3600)} hours` 
                      : 'Ready to combine lineages'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Magical DNA</h2>
            <p className="font-mono text-sm bg-gray-100 p-3 rounded overflow-x-auto">
              {wizard.dna}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => trainWizard(wizardId)}
              disabled={!needsTraining}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                needsTraining
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Wand2 size={18} className="mr-2" />
              Train Wizard
            </button>
            
            <button
              onClick={() => meditateWizard(wizardId)}
              disabled={!needsMeditation}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                needsMeditation
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <BookOpen size={18} className="mr-2" />
              Meditate
            </button>
            
            <button
              onClick={() => harvestMana(wizardId)}
              disabled={!canHarvestMana}
              className={`flex items-center justify-center py-2 px-4 rounded-md ${
                canHarvestMana
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={18} className="mr-2" />
              Harvest Mana
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
              <h3 className="text-lg font-medium text-gray-800 mb-3">List Wizard for Sale</h3>
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

export default WizardDetail;