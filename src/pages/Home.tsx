import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, BookOpen, Sparkles, Scroll, Zap } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

const Home: React.FC = () => {
  const { account, connectWallet } = useWizard();

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-6">
            Welcome to Wizard Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Summon, train, and trade unique wizards on the blockchain. Master arcane spells, brew potions, and build your magical legacy!
          </p>
          
          {account ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/my-wizards" 
                className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
              >
                View My Wizards
              </Link>
              <Link 
                to="/academy" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Enter the Academy
              </Link>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-white rounded-lg shadow-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Summon Wizards</h3>
            <p className="text-gray-600">
              Summon your first wizard for free. Each wizard has unique magical DNA that determines their elemental affinity and powers.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Train & Meditate</h3>
            <p className="text-gray-600">
              Train and meditate with your wizards to level them up. Combine two wizards to create an apprentice with mixed magical abilities.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Trade & Sell</h3>
            <p className="text-gray-600">
              List your wizards on the marketplace. Rare wizards with powerful magical affinities are more valuable.
            </p>
          </div>
        </div>
      </section>
      
      {/* Academy Section */}
      <section className="py-12 mt-12 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Academy Mechanics</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Master the arcane arts and build your magical collection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Grimoires</h3>
            <p className="text-gray-600 text-sm">
              Purchase magical grimoires with varying potency and size. More powerful grimoires can hold stronger spells.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Scroll size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Spells</h3>
            <p className="text-gray-600 text-sm">
              Inscribe different types of spells in your grimoires. Channel magic regularly to empower your spells.
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Mana</h3>
            <p className="text-gray-600 text-sm">
              Harvest mana from your wizards. Higher level wizards produce more mana, which can be used or sold.
            </p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Casting</h3>
            <p className="text-gray-600 text-sm">
              Cast spells with your wizards to gain scrolls and improve their magical abilities.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-20 mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to begin your magical journey?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join the community of wizards and spellcasters. Your first wizard is free!
          </p>
          
          {account ? (
            <Link 
              to="/my-wizards" 
              className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-100 transition-colors"
            >
              Enter the Academy
            </Link>
          ) : (
            <button 
              onClick={connectWallet}
              className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-100 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;