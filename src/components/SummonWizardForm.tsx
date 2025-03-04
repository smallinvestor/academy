import React, { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { Wand2 } from 'lucide-react';

const SummonWizardForm: React.FC = () => {
  const [name, setName] = useState('');
  const { summonWizard, wizards, loading } = useWizard();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await summonWizard(name);
      setName('');
    }
  };
  
  const isFirstWizard = wizards.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Summon a New Wizard</h2>
      
      <p className="text-gray-600 mb-4">
        {isFirstWizard 
          ? "Summon your first wizard for FREE! Name your wizard and begin your magical journey."
          : "Summon another wizard for 0.05 ETH to expand your magical repertoire."}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Wizard Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a name for your wizard"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className={`w-full py-2 rounded-md flex items-center justify-center ${
            loading || !name.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Wand2 size={18} className="mr-2" />
          {loading ? 'Summoning...' : `Summon Wizard ${!isFirstWizard ? '(0.05 ETH)' : '(Free)'}`}
        </button>
      </form>
    </div>
  );
};

export default SummonWizardForm;