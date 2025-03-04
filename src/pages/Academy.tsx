import React, { useEffect, useState } from 'react';
import { useWizard } from '../context/WizardContext';
import GrimoireCard from '../components/GrimoireCard';
import { BookOpen, Sparkles, Scroll } from 'lucide-react';

const Academy: React.FC = () => {
  const { account, connectWallet, grimoires, loadGrimoires, resources, buyGrimoire, convertScrollsToSpells, buySpells, sellMana, loading } = useWizard();
  const [grimoireName, setGrimoireName] = useState('');
  const [spellAmount, setSpellAmount] = useState(1);
  const [scrollAmount, setScrollAmount] = useState(1);
  const [manaAmount, setManaAmount] = useState(1);
  const [activeTab, setActiveTab] = useState('grimoires');
  
  useEffect(() => {
    if (account) {
      loadGrimoires();
    }
  }, [account]);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to access the Wizard Academy and manage your grimoires.
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

  const handleBuyGrimoire = (e: React.FormEvent) => {
    e.preventDefault();
    if (grimoireName.trim()) {
      buyGrimoire(grimoireName);
      setGrimoireName('');
    }
  };
  
  const handleConvertScrolls = (e: React.FormEvent) => {
    e.preventDefault();
    if (scrollAmount > 0 && scrollAmount <= resources.scrolls) {
      convertScrollsToSpells(scrollAmount);
    }
  };
  
  const handleBuySpells = (e: React.FormEvent) => {
    e.preventDefault();
    if (spellAmount > 0) {
      buySpells(spellAmount);
    }
  };
  
  const handleSellMana = (e: React.FormEvent) => {
    e.preventDefault();
    if (manaAmount > 0 && manaAmount <= resources.mana) {
      sellMana(manaAmount);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Wizard Academy</h1>
      <p className="text-gray-600 mb-6">Master the arcane arts with grimoires, spells, and magical resources.</p>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Magical Resources</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-3 rounded-md flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <Sparkles size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mana</p>
              <p className="text-2xl font-bold text-gray-800">{resources.mana}</p>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-md flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Spells</p>
              <p className="text-2xl font-bold text-gray-800">{resources.spells}</p>
            </div>
          </div>
          <div className="bg-amber-50 p-3 rounded-md flex items-center">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <Scroll size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scrolls</p>
              <p className="text-2xl font-bold text-gray-800">{resources.scrolls}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('grimoires')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'grimoires'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Grimoires
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'market'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Arcane Market
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'grimoires' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Grimoires</h2>
            <form onSubmit={handleBuyGrimoire} className="flex">
              <input
                type="text"
                value={grimoireName}
                onChange={(e) => setGrimoireName(e.target.value)}
                placeholder="New grimoire name"
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 flex items-center"
              >
                <BookOpen size={16} className="mr-1" />
                Buy Grimoire (0.05 ETH)
              </button>
            </form>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading your grimoires...</p>
            </div>
          ) : grimoires.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Grimoires Yet</h2>
              <p className="text-gray-600 mb-6">
                You don't have any grimoires yet. Buy your first grimoire to start inscribing spells!
              </p>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Magic book" 
                  className="rounded-lg w-full max-w-md h-64 object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grimoires.map(grimoire => (
                <GrimoireCard
                  key={grimoire.id}
                  id={grimoire.id}
                  name={grimoire.name}
                  potency={grimoire.potency}
                  size={grimoire.size}
                  isInscribed={grimoire.isInscribed}
                  inscribedTime={grimoire.inscribedTime}
                  castTime={grimoire.castTime}
                  spellType={grimoire.spellType}
                  lastChanneled={grimoire.lastChanneled}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 p-2 rounded-full mr-2">
                <Scroll size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Convert Scrolls to Spells</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Convert your ancient scrolls into usable spells. 2 scrolls = 1 spell plus a bonus.
            </p>
            <form onSubmit={handleConvertScrolls}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (max: {resources.scrolls})
                </label>
                <input
                  type="number"
                  min="1"
                  max={resources.scrolls}
                  value={scrollAmount}
                  onChange={(e) => setScrollAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={scrollAmount <= 0 || scrollAmount > resources.scrolls}
                className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Convert Scrolls
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-full mr-2">
                <BookOpen size={20} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Buy Spells</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Purchase ready-made spells for your grimoires. Each spell costs 0.01 ETH.
            </p>
            <form onSubmit={handleBuySpells}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={spellAmount}
                  onChange={(e) => setSpellAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={spellAmount <= 0}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Spells
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="bg-indigo-100 p-2 rounded-full mr-2">
                <Sparkles size={20} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Sell Mana</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sell your excess mana for ETH. Each mana crystal is worth 0.005 ETH.
            </p>
            <form onSubmit={handleSellMana}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (max: {resources.mana})
                </label>
                <input
                  type="number"
                  min="1"
                  max={resources.mana}
                  value={manaAmount}
                  onChange={(e) => setManaAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={manaAmount <= 0 || manaAmount > resources.mana}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Sell Mana
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;