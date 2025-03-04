import React, { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { Sparkles } from 'lucide-react';

interface Wizard {
  id: number;
  name: string;
  level: number;
}

const BreedingForm: React.FC = () => {
  const [parent1, setParent1] = useState<number | ''>('');
  const [parent2, setParent2] = useState<number | ''>('');
  const { wizards, breedWizards, loading } = useWizard();
  
  // Filter wizards that are eligible for breeding (level 5+)
  const breedableWizards = wizards.filter(wizard => wizard.level >= 5);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parent1 !== '' && parent2 !== '' && parent1 !== parent2) {
      await breedWizards(parent1, parent2);
      setParent1('');
      setParent2('');
    }
  };
  
  const notEnoughWizards = breedableWizards.length < 2;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Combine Magical Lineages</h2>
      
      {notEnoughWizards ? (
        <div className="text-gray-600">
          <p>You need at least two wizards of level 5 or higher to combine their magical lineages.</p>
          <p className="mt-2">Keep training and meditating with your wizards to level them up!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Select two different wizards to combine their magical lineages. This ritual costs 0.01 ETH and creates a new apprentice wizard with combined powers.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="parent1" className="block text-sm font-medium text-gray-700 mb-1">
                First Wizard
              </label>
              <select
                id="parent1"
                value={parent1}
                onChange={(e) => setParent1(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a wizard</option>
                {breedableWizards.map(wizard => (
                  <option key={wizard.id} value={wizard.id} disabled={wizard.id === parent2}>
                    {wizard.name} (Level {wizard.level})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="parent2" className="block text-sm font-medium text-gray-700 mb-1">
                Second Wizard
              </label>
              <select
                id="parent2"
                value={parent2}
                onChange={(e) => setParent2(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a wizard</option>
                {breedableWizards.map(wizard => (
                  <option key={wizard.id} value={wizard.id} disabled={wizard.id === parent1}>
                    {wizard.name} (Level {wizard.level})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading || parent1 === '' || parent2 === '' || parent1 === parent2}
              className={`w-full py-2 rounded-md flex items-center justify-center ${
                loading || parent1 === '' || parent2 === '' || parent1 === parent2
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Sparkles size={18} className="mr-2" />
              {loading ? 'Combining...' : 'Combine Magical Lineages (0.01 ETH)'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default BreedingForm;