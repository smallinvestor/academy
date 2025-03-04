import React, { useEffect, useState } from 'react';
import { useWizard } from '../context/WizardContext';
import MarketplaceCard from '../components/MarketplaceCard';

const Marketplace: React.FC = () => {
  const { account, connectWallet, listings, loadListings, loading, error } = useWizard();
  const [wizardDetails, setWizardDetails] = useState<Record<number, any>>({});
  
  useEffect(() => {
    if (account) {
      loadListings();
    }
  }, [account]);
  
  // This would fetch wizard details from the contract for each listing
  // In a real implementation, you'd want to batch these requests
  useEffect(() => {
    const fetchWizardDetails = async () => {
      // Mock implementation - in a real app, you'd fetch from the contract
      const details: Record<number, any> = {};
      
      listings.forEach(listing => {
        // Generate mock data based on token ID
        const tokenId = listing.tokenId;
        const dna = (BigInt(tokenId) * BigInt(12345)).toString(16).padStart(16, '0');
        const level = (tokenId % 20) + 1;
        const rarity = (tokenId % 100) + 1;
        
        details[tokenId] = {
          name: `Wizard #${tokenId}`,
          dna,
          level,
          rarity
        };
      });
      
      setWizardDetails(details);
    };
    
    if (listings.length > 0) {
      fetchWizardDetails();
    }
  }, [listings]);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Please connect your wallet to browse the marketplace and acquire wizards.
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Wizard Marketplace</h1>
      <p className="text-gray-600 mb-8">Browse and acquire unique wizards from other mages.</p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading marketplace listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Listings Available</h2>
          <p className="text-gray-600">
            There are currently no wizards listed for sale. Check back later or list one of your own wizards!
          </p>
          <div className="flex justify-center mt-6">
            <img 
              src="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Empty marketplace" 
              className="rounded-lg w-full max-w-md h-64 object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <MarketplaceCard
              key={listing.tokenId}
              tokenId={listing.tokenId}
              seller={listing.seller}
              price={listing.price}
              name={wizardDetails[listing.tokenId]?.name || `Wizard #${listing.tokenId}`}
              level={wizardDetails[listing.tokenId]?.level || 1}
              rarity={wizardDetails[listing.tokenId]?.rarity || 1}
              dna={wizardDetails[listing.tokenId]?.dna || '0000000000000000'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;