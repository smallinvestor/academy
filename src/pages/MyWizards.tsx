import React, { useEffect } from 'react';
import { useWizard } from '../context/WizardContext';
import WizardCard from '../components/WizardCard';
import SummonWizardForm from '../components/SummonWizardForm';
import BreedingForm from '../components/BreedingForm';

const MyWizards: React.FC = () => {
  const { account, wizards, loadWizards, connectWallet, loading } = useWizard();
  
  useEffect(() => {
    if (account) {
      loadWizards();
    }
  }, [account]);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to view your wizards and start your magical journey.
        </p>
        <button 
          onClick={connectWallet}
          className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wizard Collection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Summoning your wizards...</p>
            </div>
          ) : wizards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Wizards Yet</h2>
              <p className="text-gray-600 mb-6">
                You don't have any wizards yet. Summon your first wizard for free to start your magical journey!
              </p>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Magic book" 
                  className="rounded-lg w-full max-w-md h-64 object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wizards.map(wizard => (
                <WizardCard
                  key={wizard.id}
                  id={wizard.id}
                  name={wizard.name}
                  dna={wizard.dna}
                  level={wizard.level}
                  rarity={wizard.rarity}
                  lastTrained={wizard.lastTrained}
                  lastMeditated={wizard.lastMeditated}
                  mana={wizard.mana}
                  lastHarvested={wizard.lastHarvested}
                  wisdom={wizard.wisdom}
                  energy={wizard.energy}
                  spellPower={wizard.spellPower}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <SummonWizardForm />
          <BreedingForm />
        </div>
      </div>
    </div>
  );
};

export default MyWizards;