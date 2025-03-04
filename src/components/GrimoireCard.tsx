import React, { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { BookOpen, Sparkles, Zap } from 'lucide-react';

interface GrimoireCardProps {
  id: number;
  name: string;
  potency: number;
  size: number;
  isInscribed: boolean;
  inscribedTime: number;
  castTime: number;
  spellType: string;
  lastChanneled: number;
}

const GrimoireCard: React.FC<GrimoireCardProps> = ({
  id,
  name,
  potency,
  size,
  isInscribed,
  inscribedTime,
  castTime,
  spellType,
  lastChanneled
}) => {
  const { wizards, inscribeSpell, channelMagic, castSpell, resources } = useWizard();
  const [selectedSpell, setSelectedSpell] = useState('Fireball');
  const [selectedWizard, setSelectedWizard] = useState<number | ''>('');
  
  // Calculate time until cast
  const getTimeUntilCast = () => {
    if (!isInscribed) return '';
    
    const now = Math.floor(Date.now() / 1000);
    if (now >= castTime) return 'Ready to cast!';
    
    const seconds = castTime - now;
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };
  
  // Calculate time since last channeled
  const getTimeSinceChanneled = () => {
    if (!isInscribed || lastChanneled === 0) return 'Not channeled yet';
    
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - lastChanneled;
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Check if grimoire needs channeling
  const needsChanneling = isInscribed && Math.floor(Date.now() / 1000) - lastChanneled > 4 * 3600;
  
  // Check if spell is ready to cast
  const readyToCast = isInscribed && Math.floor(Date.now() / 1000) >= castTime;
  
  // Handle inscribing
  const handleInscribe = () => {
    if (resources.spells > 0) {
      inscribeSpell(id, selectedSpell);
    }
  };
  
  // Handle casting
  const handleCast = () => {
    if (selectedWizard !== '') {
      castSpell(id, Number(selectedWizard));
    }
  };
  
  // Get potency color
  const getPotencyColor = () => {
    if (potency >= 80) return 'text-purple-600';
    if (potency >= 60) return 'text-blue-600';
    if (potency >= 40) return 'text-green-600';
    if (potency >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get spell emoji
  const getSpellEmoji = () => {
    if (!isInscribed) return '';
    
    switch(spellType.toLowerCase()) {
      case 'fireball':
        return '🔥';
      case 'frostbolt':
        return '❄️';
      case 'arcane missile':
        return '✨';
      case 'healing':
        return '💚';
      default:
        return '📜';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm">Size: {size} pages</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Potency</span>
            <span className={getPotencyColor()}>{potency}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full" 
              style={{ width: `${potency}%` }}
            ></div>
          </div>
        </div>
        
        {isInscribed ? (
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <div className="flex items-center">
                <span className="mr-2 text-xl">{getSpellEmoji()}</span>
                <span>Spell: {spellType}</span>
              </div>
              <span className={readyToCast ? 'text-green-600 font-bold' : 'text-gray-600'}>
                {getTimeUntilCast()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <Sparkles size={14} className="mr-1 text-purple-500" />
              <span>Channeled: {getTimeSinceChanneled()}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full ${readyToCast ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ 
                  width: readyToCast 
                    ? '100%' 
                    : `${((Math.floor(Date.now() / 1000) - inscribedTime) / (castTime - inscribedTime)) * 100}%` 
                }}
              ></div>
            </div>
            
            {readyToCast ? (
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Wizard for Casting
                  </label>
                  <select
                    value={selectedWizard}
                    onChange={(e) => setSelectedWizard(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select a wizard</option>
                    {wizards.map(wizard => (
                      <option key={wizard.id} value={wizard.id}>
                        {wizard.name} (Power: {wizard.spellPower})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher spell power yields more powerful effects!
                  </p>
                </div>
                
                <button
                  onClick={handleCast}
                  disabled={selectedWizard === ''}
                  className={`w-full py-2 rounded-md flex items-center justify-center ${
                    selectedWizard === ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <Zap size={18} className="mr-2" />
                  Cast Spell
                </button>
              </div>
            ) : (
              <button
                onClick={() => channelMagic(id)}
                disabled={!needsChanneling}
                className={`w-full py-2 rounded-md flex items-center justify-center ${
                  needsChanneling
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles size={18} className="mr-2" />
                Channel Magic
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              This grimoire is ready for inscription. You have {resources.spells} spells available.
            </p>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Spell Type
              </label>
              <select
                value={selectedSpell}
                onChange={(e) => setSelectedSpell(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="Fireball">Fireball</option>
                <option value="Frostbolt">Frostbolt</option>
                <option value="Arcane Missile">Arcane Missile</option>
                <option value="Healing">Healing</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Different spells have different effects and power levels.
              </p>
            </div>
            
            <button
              onClick={handleInscribe}
              disabled={resources.spells <= 0}
              className={`w-full py-2 rounded-md flex items-center justify-center ${
                resources.spells <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <BookOpen size={18} className="mr-2" />
              Inscribe {selectedSpell}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrimoireCard;