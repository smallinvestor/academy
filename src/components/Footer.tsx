import React from 'react';
import { Github, Twitter, BookOpen, Wand2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Wand2 size={24} className="text-white mr-2" />
              <h3 className="text-xl font-bold">Wizard Academy</h3>
            </div>
            <p className="text-purple-200">
              A blockchain-based magical academy where you can summon, train, and trade unique wizards.
              Master the arcane arts and build your magical legacy!
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-purple-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="/my-wizards" className="text-purple-200 hover:text-white transition-colors">My Wizards</a></li>
              <li><a href="/academy" className="text-purple-200 hover:text-white transition-colors flex items-center">
                <BookOpen size={16} className="mr-1" />Academy
              </a></li>
              <li><a href="/marketplace" className="text-purple-200 hover:text-white transition-colors">Marketplace</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
            <p className="mt-4 text-purple-200">
              © 2025 Wizard Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;