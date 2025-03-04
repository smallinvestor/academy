import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, BookOpen } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

const Navbar: React.FC = () => {
  const { account, connectWallet } = useWizard();

  return (
    <nav className="bg-purple-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Wand2 size={32} className="text-white" />
            <span className="text-xl font-bold">Wizard Academy</span>
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-purple-200 transition-colors">
              Home
            </Link>
            <Link to="/my-wizards" className="hover:text-purple-200 transition-colors">
              My Wizards
            </Link>
            <Link to="/academy" className="hover:text-purple-200 transition-colors flex items-center">
              <BookOpen size={18} className="mr-1" />
              Academy
            </Link>
            <Link to="/marketplace" className="hover:text-purple-200 transition-colors">
              Marketplace
            </Link>
          </div>
          
          <div>
            {account ? (
              <div className="bg-purple-800 px-4 py-2 rounded-full">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="bg-white text-purple-900 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;