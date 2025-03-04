import React, { useState } from 'react';
import { useAlpaca } from '../context/AlpacaContext';
import { Droplets, Tractor, Leaf } from 'lucide-react';

interface LandCardProps {
  id: number;
  name: string;
  fertility: number;
  size: number;
  isPlanted: boolean;
  plantedTime: number;
  harvestTime: number;
  cropType: string;
  lastWatered: number;
}

const LandCard: React.FC<LandCardProps> = ({
  id,
  name,
  fertility,
  size,
  isPlanted,
  plantedTime,
  harvestTime,
  cropType,
  lastWatered
}) => {
  const { alpacas, plantCrops, waterCrops, harvestCrops, resources } = useAlpaca();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedAlpaca, setSelectedAlpaca] = useState<number | ''>('');
  
  // Calculate time until harvest
  const getTimeUntilHarvest = () => {
    if (!isPlanted) return '';
    
    const now = Math.floor(Date.now() / 1000);
    if (now >= harvestTime) return 'Ready to harvest!';
    
    const seconds = harvestTime - now;
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };
  
  // Calculate time since last watered
  const getTimeSinceWatered = () => {
    if (!isPlanted || lastWatered === 0) return 'Not watered yet';
    
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - lastWatered;
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Check if land needs watering
  const needsWatering = isPlanted && Math.floor(Date.now() / 1000) - lastWatered > 4 * 3600;
  
  // Check if crops are ready to harvest
  const readyToHarvest = isPlanted && Math.floor(Date.now() / 1000) >= harvestTime;
  
  // Handle planting
  const handlePlant = () => {
    if (resources.seeds > 0) {
      plantCrops(id, selectedCrop);
    }
  };
  
  // Handle harvesting
  const handleHarvest = () => {
    if (selectedAlpaca !== '') {
      harvestCrops(id, Number(selectedAlpaca));
    }
  };
  
  // Get fertility color
  const getFertilityColor = () => {
    if (fertility >= 80) return 'text-green-600';
    if (fertility >= 60) return 'text-lime-600';
    if (fertility >= 40) return 'text-yellow-600';
    if (fertility >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get crop image based on type
  const getCropImage = () => {
    switch(cropType.toLowerCase()) {
      case 'wheat':
        return '🌾';
      case 'corn':
        return '🌽';
      case 'barley':
        return '🌿';
      case 'oats':
        return '🌱';
      default:
        return '🌾';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm">Size: {size} acres</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Fertility</span>
            <span className={getFertilityColor()}>{fertility}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${fertility}%` }}
            ></div>
          </div>
        </div>
        
        {isPlanted ? (
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <div className="flex items-center">
                <span className="mr-2 text-xl">{getCropImage()}</span>
                <span>Crop: {cropType}</span>
              </div>
              <span className={readyToHarvest ? 'text-green-600 font-bold' : 'text-gray-600'}>
                {getTimeUntilHarvest()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <Droplets size={14} className="mr-1 text-blue-500" />
              <span>Watered: {getTimeSinceWatered()}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full ${readyToHarvest ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ 
                  width: readyToHarvest 
                    ? '100%' 
                    : `${((Math.floor(Date.now() / 1000) - plantedTime) / (harvestTime - plantedTime)) * 100}%` 
                }}
              ></div>
            </div>
            
            {readyToHarvest ? (
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Alpaca for Harvesting
                  </label>
                  <select
                    value={selectedAlpaca}
                    onChange={(e) => setSelectedAlpaca(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select an alpaca</option>
                    {alpacas.map(alpaca => (
                      <option key={alpaca.id} value={alpaca.id}>
                        {alpaca.name} (Farming: {alpaca.farmingSkill})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher farming skill yields more crops!
                  </p>
                </div>
                
                <button
                  onClick={handleHarvest}
                  disabled={selectedAlpaca === ''}
                  className={`w-full py-2 rounded-md flex items-center justify-center ${
                    selectedAlpaca === ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Tractor size={18} className="mr-2" />
                  Harvest Crops
                </button>
              </div>
            ) : (
              <button
                onClick={() => waterCrops(id)}
                disabled={!needsWatering}
                className={`w-full py-2 rounded-md flex items-center justify-center ${
                  needsWatering
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Droplets size={18} className="mr-2" />
                Water Crops
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              This land is ready for planting. You have {resources.seeds} seeds available.
            </p>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Crop Type
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="Wheat">Wheat</option>
                <option value="Corn">Corn</option>
                <option value="Barley">Barley</option>
                <option value="Oats">Oats</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Different crops have different growth rates and yields.
              </p>
            </div>
            
            <button
              onClick={handlePlant}
              disabled={resources.seeds <= 0}
              className={`w-full py-2 rounded-md flex items-center justify-center ${
                resources.seeds <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <Leaf size={18} className="mr-2" />
              Plant {selectedCrop}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandCard;