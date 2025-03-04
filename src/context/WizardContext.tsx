import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Temporary mock artifacts until we compile the contracts
const WizardAcademyArtifact = {
  abi: [
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function getWizardsByOwner(address _owner) view returns (uint256[])",
    "function getWizard(uint256 _tokenId) view returns (string, uint256, uint8, uint8, uint256, uint256, uint256, uint256, uint256, uint8, uint8, uint8)",
    "function summonWizard(string memory _name) payable",
    "function trainWizard(uint256 _tokenId)",
    "function meditateWizard(uint256 _tokenId)",
    "function harvestMana(uint256 _tokenId)",
    "function breedWizards(uint256 _wizard1Id, uint256 _wizard2Id) payable",
    "function breedingFee() view returns (uint256)",
    "function buyGrimoire(string memory _name) payable",
    "function getGrimoiresByOwner(address _owner) view returns (uint256[])",
    "function getGrimoire(uint256 _grimoireId) view returns (uint256, address, string, uint8, uint8, bool, uint256, uint256, string, uint256)",
    "function inscribeSpell(uint256 _grimoireId, string memory _spellType)",
    "function channelMagic(uint256 _grimoireId)",
    "function castSpell(uint256 _grimoireId, uint256 _wizardId)",
    "function getPlayerResources(address _player) view returns (uint256, uint256, uint256)",
    "function convertScrollsToSpells(uint256 _amount)",
    "function buySpells(uint256 _amount) payable",
    "function sellMana(uint256 _amount)"
  ]
};

const WizardMarketArtifact = {
  abi: [
    "function listings(uint256 tokenId) view returns (address seller, uint256 price, bool active)",
    "function getActiveListings() view returns (uint256[])",
    "function listWizard(uint256 _tokenId, uint256 _price)",
    "function buyWizard(uint256 _tokenId) payable",
    "function cancelListing(uint256 _tokenId)"
  ]
};

// Contract addresses - these would be set after deployment
const WIZARD_ACADEMY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const WIZARD_MARKET_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

interface Wizard {
  id: number;
  name: string;
  dna: string;
  level: number;
  rarity: number;
  lastTrained: number;
  lastMeditated: number;
  breedingCooldown: number;
  mana: number;
  lastHarvested: number;
  wisdom: number;
  energy: number;
  spellPower: number;
}

interface Grimoire {
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

interface Resources {
  mana: number;
  spells: number;
  scrolls: number;
}

interface Listing {
  tokenId: number;
  seller: string;
  price: string;
  active: boolean;
}

interface WizardContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  wizards: Wizard[];
  grimoires: Grimoire[];
  resources: Resources;
  loadWizards: () => Promise<void>;
  loadGrimoires: () => Promise<void>;
  loadResources: () => Promise<void>;
  summonWizard: (name: string) => Promise<void>;
  trainWizard: (tokenId: number) => Promise<void>;
  meditateWizard: (tokenId: number) => Promise<void>;
  harvestMana: (tokenId: number) => Promise<void>;
  breedWizards: (wizard1Id: number, wizard2Id: number) => Promise<void>;
  buyGrimoire: (name: string) => Promise<void>;
  inscribeSpell: (grimoireId: number, spellType: string) => Promise<void>;
  channelMagic: (grimoireId: number) => Promise<void>;
  castSpell: (grimoireId: number, wizardId: number) => Promise<void>;
  convertScrollsToSpells: (amount: number) => Promise<void>;
  buySpells: (amount: number) => Promise<void>;
  sellMana: (amount: number) => Promise<void>;
  listWizard: (tokenId: number, price: string) => Promise<void>;
  buyWizard: (tokenId: number, price: string) => Promise<void>;
  cancelListing: (tokenId: number) => Promise<void>;
  listings: Listing[];
  loadListings: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [grimoires, setGrimoires] = useState<Grimoire[]>([]);
  const [resources, setResources] = useState<Resources>({ mana: 0, spells: 0, scrolls: 0 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [academyContract, setAcademyContract] = useState<ethers.Contract | null>(null);
  const [marketContract, setMarketContract] = useState<ethers.Contract | null>(null);

  // Initialize provider and contracts
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const academy = new ethers.Contract(
            WIZARD_ACADEMY_ADDRESS,
            WizardAcademyArtifact.abi,
            web3Provider
          );
          setAcademyContract(academy);

          const market = new ethers.Contract(
            WIZARD_MARKET_ADDRESS,
            WizardMarketArtifact.abi,
            web3Provider
          );
          setMarketContract(market);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          }
        } catch (err) {
          console.error("Failed to initialize provider:", err);
          setError("Failed to connect to blockchain");
        }
      } else {
        setError("Ethereum wallet not detected. Please install MetaMask.");
      }
    };

    init();
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum wallet not detected. Please install MetaMask.");
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (provider) {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          await loadWizards();
          await loadGrimoires();
          await loadResources();
          await loadListings();
        }
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  // Load user's wizards
  const loadWizards = async () => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      // Get all wizard IDs owned by the user
      const wizardIds = await connectedAcademy.getWizardsByOwner(account);
      
      // Get details for each wizard
      const wizardPromises = wizardIds.map(async (id: bigint) => {
        const wizard = await connectedAcademy.getWizard(id);
        return {
          id: Number(id),
          name: wizard[0],
          dna: wizard[1].toString(),
          level: Number(wizard[2]),
          rarity: Number(wizard[3]),
          lastTrained: Number(wizard[4]),
          lastMeditated: Number(wizard[5]),
          breedingCooldown: Number(wizard[6]),
          mana: Number(wizard[7]),
          lastHarvested: Number(wizard[8]),
          wisdom: Number(wizard[9]),
          energy: Number(wizard[10]),
          spellPower: Number(wizard[11])
        };
      });
      
      const wizardData = await Promise.all(wizardPromises);
      setWizards(wizardData);
    } catch (err) {
      console.error("Failed to load wizards:", err);
      setError("Failed to load your wizards");
    } finally {
      setLoading(false);
    }
  };

  // Load user's grimoires
  const loadGrimoires = async () => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      // Get all grimoire IDs owned by the user
      const grimoireIds = await connectedAcademy.getGrimoiresByOwner(account);
      
      // Get details for each grimoire
      const grimoirePromises = grimoireIds.map(async (id: bigint) => {
        const grimoire = await connectedAcademy.getGrimoire(id);
        return {
          id: Number(grimoire[0]),
          name: grimoire[2],
          potency: Number(grimoire[3]),
          size: Number(grimoire[4]),
          isInscribed: grimoire[5],
          inscribedTime: Number(grimoire[6]),
          castTime: Number(grimoire[7]),
          spellType: grimoire[8],
          lastChanneled: Number(grimoire[9])
        };
      });
      
      const grimoireData = await Promise.all(grimoirePromises);
      setGrimoires(grimoireData);
    } catch (err) {
      console.error("Failed to load grimoires:", err);
      setError("Failed to load your grimoires");
    } finally {
      setLoading(false);
    }
  };

  // Load user's resources
  const loadResources = async () => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      // Get resources
      const resourceData = await connectedAcademy.getPlayerResources(account);
      
      setResources({
        mana: Number(resourceData[0]),
        spells: Number(resourceData[1]),
        scrolls: Number(resourceData[2])
      });
    } catch (err) {
      console.error("Failed to load resources:", err);
      setError("Failed to load your resources");
    } finally {
      setLoading(false);
    }
  };

  // Summon a new wizard
  const summonWizard = async (name: string) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      // Check if this is the first wizard (free) or not
      const balance = await connectedAcademy.balanceOf(account);
      const value = balance > 0 ? ethers.parseEther("0.05") : 0;
      
      const tx = await connectedAcademy.summonWizard(name, { value });
      await tx.wait();
      
      await loadWizards();
    } catch (err) {
      console.error("Failed to summon wizard:", err);
      setError("Failed to summon wizard");
    } finally {
      setLoading(false);
    }
  };

  // Train a wizard
  const trainWizard = async (tokenId: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.trainWizard(tokenId);
      await tx.wait();
      
      await loadWizards();
    } catch (err) {
      console.error("Failed to train wizard:", err);
      setError("Failed to train wizard");
    } finally {
      setLoading(false);
    }
  };

  // Meditate with a wizard
  const meditateWizard = async (tokenId: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.meditateWizard(tokenId);
      await tx.wait();
      
      await loadWizards();
    } catch (err) {
      console.error("Failed to meditate wizard:", err);
      setError("Failed to meditate wizard");
    } finally {
      setLoading(false);
    }
  };

  // Harvest mana from a wizard
  const harvestMana = async (tokenId: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.harvestMana(tokenId);
      await tx.wait();
      
      await loadWizards();
      await loadResources();
    } catch (err) {
      console.error("Failed to harvest mana:", err);
      setError("Failed to harvest mana");
    } finally {
      setLoading(false);
    }
  };

  // Breed two wizards
  const breedWizards = async (wizard1Id: number, wizard2Id: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      // Get breeding fee
      const breedingFee = await connectedAcademy.breedingFee();
      
      const tx = await connectedAcademy.breedWizards(wizard1Id, wizard2Id, { value: breedingFee });
      await tx.wait();
      
      await loadWizards();
    } catch (err) {
      console.error("Failed to breed wizards:", err);
      setError("Failed to breed wizards");
    } finally {
      setLoading(false);
    }
  };

  // Buy a grimoire
  const buyGrimoire = async (name: string) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.buyGrimoire(name, { value: ethers.parseEther("0.05") });
      await tx.wait();
      
      await loadGrimoires();
    } catch (err) {
      console.error("Failed to buy grimoire:", err);
      setError("Failed to buy grimoire");
    } finally {
      setLoading(false);
    }
  };

  // Inscribe a spell in a grimoire
  const inscribeSpell = async (grimoireId: number, spellType: string) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.inscribeSpell(grimoireId, spellType);
      await tx.wait();
      
      await loadGrimoires();
      await loadResources();
    } catch (err) {
      console.error("Failed to inscribe spell:", err);
      setError("Failed to inscribe spell");
    } finally {
      setLoading(false);
    }
  };

  // Channel magic in a grimoire
  const channelMagic = async (grimoireId: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.channelMagic(grimoireId);
      await tx.wait();
      
      await loadGrimoires();
    } catch (err) {
      console.error("Failed to channel magic:", err);
      setError("Failed to channel magic");
    } finally {
      setLoading(false);
    }
  };

  // Cast a spell
  const castSpell = async (grimoireId: number, wizardId: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.castSpell(grimoireId, wizardId);
      await tx.wait();
      
      await loadGrimoires();
      await loadWizards();
      await loadResources();
    } catch (err) {
      console.error("Failed to cast spell:", err);
      setError("Failed to cast spell");
    } finally {
      setLoading(false);
    }
  };

  // Convert scrolls to spells
  const convertScrollsToSpells = async (amount: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.convertScrollsToSpells(amount);
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to convert scrolls to spells:", err);
      setError("Failed to convert scrolls to spells");
    } finally {
      setLoading(false);
    }
  };

  // Buy spells
  const buySpells = async (amount: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.buySpells(amount, { value: ethers.parseEther((0.001 * amount).toString()) });
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to buy spells:", err);
      setError("Failed to buy spells");
    } finally {
      setLoading(false);
    }
  };

  // Sell mana
  const sellMana = async (amount: number) => {
    if (!account || !academyContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedAcademy = academyContract.connect(signer);
      
      const tx = await connectedAcademy.sellMana(amount);
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to sell mana:", err);
      setError("Failed to sell mana");
    } finally {
      setLoading(false);
    }
  };

  // Load marketplace listings
  const loadListings = async () => {
    if (!marketContract) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get all active listings
      const activeListingIds = await marketContract.getActiveListings();
      
      // Get details for each listing
      const listingPromises = activeListingIds.map(async (id: bigint) => {
        const listing = await marketContract.listings(id);
        return {
          tokenId: Number(id),
          seller: listing.seller,
          price: ethers.formatEther(listing.price),
          active: listing.active
        };
      });
      
      const listingData = await Promise.all(listingPromises);
      setListings(listingData);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setError("Failed to load marketplace listings");
    } finally {
      setLoading(false);
    }
  };

  // List a wizard for sale
  const listWizard = async (tokenId: number, price: string) => {
    if (!account || !marketContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedMarket = marketContract.connect(signer);
      
      const priceInWei = ethers.parseEther(price);
      const tx = await connectedMarket.listWizard(tokenId, priceInWei);
      await tx.wait();
      
      await loadListings();
      await loadWizards();
    } catch (err) {
      console.error("Failed to list wizard:", err);
      setError("Failed to list wizard for sale");
    } finally {
      setLoading(false);
    }
  };

  // Buy a wizard
  const buyWizard = async (tokenId: number, price: string) => {
    if (!account || !marketContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedMarket = marketContract.connect(signer);
      
      const priceInWei = ethers.parseEther(price);
      const tx = await connectedMarket.buyWizard(tokenId, { value: priceInWei });
      await tx.wait();
      
      await loadListings();
      await loadWizards();
    } catch (err) {
      console.error("Failed to buy wizard:", err);
      setError("Failed to buy wizard");
    } finally {
      setLoading(false);
    }
  };

  // Cancel a listing
  const cancelListing = async (tokenId: number) => {
    if (!account || !marketContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedMarket = marketContract.connect(signer);
      
      const tx = await connectedMarket.cancelListing(tokenId);
      await tx.wait();
      
      await loadListings();
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      setError("Failed to cancel listing");
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setWizards([]);
          setGrimoires([]);
          setResources({ mana: 0, spells: 0, scrolls: 0 });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Load data when account changes
  useEffect(() => {
    if (account) {
      loadWizards();
      loadGrimoires();
      loadResources();
      loadListings();
    }
  }, [account]);

  const value = {
    account,
    connectWallet,
    wizards,
    grimoires,
    resources,
    loadWizards,
    loadGrimoires,
    loadResources,
    summonWizard,
    trainWizard,
    meditateWizard,
    harvestMana,
    breedWizards,
    buyGrimoire,
    inscribeSpell,
    channelMagic,
    castSpell,
    convertScrollsToSpells,
    buySpells,
    sellMana,
    listWizard,
    buyWizard,
    cancelListing,
    listings,
    loadListings,
    loading,
    error
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};