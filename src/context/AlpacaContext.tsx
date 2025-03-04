import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Temporary mock artifacts until we compile the contracts
const AlpacaFarmArtifact = {
  abi: [
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function getAlpacasByOwner(address _owner) view returns (uint256[])",
    "function getAlpaca(uint256 _tokenId) view returns (string, uint256, uint8, uint8, uint256, uint256, uint256, uint256, uint256, uint8, uint8, uint8)",
    "function mintAlpaca(string memory _name) payable",
    "function feedAlpaca(uint256 _tokenId)",
    "function groomAlpaca(uint256 _tokenId)",
    "function shearAlpaca(uint256 _tokenId)",
    "function breedAlpacas(uint256 _alpaca1Id, uint256 _alpaca2Id) payable",
    "function breedingFee() view returns (uint256)",
    "function buyLandPlot(string memory _name) payable",
    "function getLandsByOwner(address _owner) view returns (uint256[])",
    "function getLand(uint256 _landId) view returns (uint256, address, string, uint8, uint8, bool, uint256, uint256, string, uint256)",
    "function plantCrops(uint256 _landId, string memory _cropType)",
    "function waterCrops(uint256 _landId)",
    "function harvestCrops(uint256 _landId, uint256 _alpacaId)",
    "function getPlayerResources(address _player) view returns (uint256, uint256, uint256)",
    "function convertCropsToSeeds(uint256 _amount)",
    "function buySeeds(uint256 _amount) payable",
    "function sellWool(uint256 _amount)"
  ]
};

const AlpacaMarketArtifact = {
  abi: [
    "function listings(uint256 tokenId) view returns (address seller, uint256 price, bool active)",
    "function getActiveListings() view returns (uint256[])",
    "function listAlpaca(uint256 _tokenId, uint256 _price)",
    "function buyAlpaca(uint256 _tokenId) payable",
    "function cancelListing(uint256 _tokenId)"
  ]
};

// Contract addresses - these would be set after deployment
const ALPACA_FARM_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const ALPACA_MARKET_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

interface Alpaca {
  id: number;
  name: string;
  dna: string;
  level: number;
  rarity: number;
  lastFed: number;
  lastGroomed: number;
  breedingCooldown: number;
  wool: number;
  lastSheared: number;
  happiness: number;
  energy: number;
  farmingSkill: number;
}

interface LandPlot {
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

interface Resources {
  wool: number;
  seeds: number;
  crops: number;
}

interface Listing {
  tokenId: number;
  seller: string;
  price: string;
  active: boolean;
}

interface AlpacaContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  alpacas: Alpaca[];
  lands: LandPlot[];
  resources: Resources;
  loadAlpacas: () => Promise<void>;
  loadLands: () => Promise<void>;
  loadResources: () => Promise<void>;
  mintAlpaca: (name: string) => Promise<void>;
  feedAlpaca: (tokenId: number) => Promise<void>;
  groomAlpaca: (tokenId: number) => Promise<void>;
  shearAlpaca: (tokenId: number) => Promise<void>;
  breedAlpacas: (alpaca1Id: number, alpaca2Id: number) => Promise<void>;
  buyLandPlot: (name: string) => Promise<void>;
  plantCrops: (landId: number, cropType: string) => Promise<void>;
  waterCrops: (landId: number) => Promise<void>;
  harvestCrops: (landId: number, alpacaId: number) => Promise<void>;
  convertCropsToSeeds: (amount: number) => Promise<void>;
  buySeeds: (amount: number) => Promise<void>;
  sellWool: (amount: number) => Promise<void>;
  listAlpaca: (tokenId: number, price: string) => Promise<void>;
  buyAlpaca: (tokenId: number, price: string) => Promise<void>;
  cancelListing: (tokenId: number) => Promise<void>;
  listings: Listing[];
  loadListings: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AlpacaContext = createContext<AlpacaContextType | undefined>(undefined);

export const useAlpaca = () => {
  const context = useContext(AlpacaContext);
  if (context === undefined) {
    throw new Error('useAlpaca must be used within an AlpacaProvider');
  }
  return context;
};

interface AlpacaProviderProps {
  children: ReactNode;
}

export const AlpacaProvider: React.FC<AlpacaProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [alpacas, setAlpacas] = useState<Alpaca[]>([]);
  const [lands, setLands] = useState<LandPlot[]>([]);
  const [resources, setResources] = useState<Resources>({ wool: 0, seeds: 0, crops: 0 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [farmContract, setFarmContract] = useState<ethers.Contract | null>(null);
  const [marketContract, setMarketContract] = useState<ethers.Contract | null>(null);

  // Initialize provider and contracts
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const farm = new ethers.Contract(
            ALPACA_FARM_ADDRESS,
            AlpacaFarmArtifact.abi,
            web3Provider
          );
          setFarmContract(farm);

          const market = new ethers.Contract(
            ALPACA_MARKET_ADDRESS,
            AlpacaMarketArtifact.abi,
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
          await loadAlpacas();
          await loadLands();
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

  // Load user's alpacas
  const loadAlpacas = async () => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      // Get all alpaca IDs owned by the user
      const alpacaIds = await connectedFarm.getAlpacasByOwner(account);
      
      // Get details for each alpaca
      const alpacaPromises = alpacaIds.map(async (id: bigint) => {
        const alpaca = await connectedFarm.getAlpaca(id);
        return {
          id: Number(id),
          name: alpaca[0],
          dna: alpaca[1].toString(),
          level: Number(alpaca[2]),
          rarity: Number(alpaca[3]),
          lastFed: Number(alpaca[4]),
          lastGroomed: Number(alpaca[5]),
          breedingCooldown: Number(alpaca[6]),
          wool: Number(alpaca[7]),
          lastSheared: Number(alpaca[8]),
          happiness: Number(alpaca[9]),
          energy: Number(alpaca[10]),
          farmingSkill: Number(alpaca[11])
        };
      });
      
      const alpacaData = await Promise.all(alpacaPromises);
      setAlpacas(alpacaData);
    } catch (err) {
      console.error("Failed to load alpacas:", err);
      setError("Failed to load your alpacas");
    } finally {
      setLoading(false);
    }
  };

  // Load user's land plots
  const loadLands = async () => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      // Get all land IDs owned by the user
      const landIds = await connectedFarm.getLandsByOwner(account);
      
      // Get details for each land
      const landPromises = landIds.map(async (id: bigint) => {
        const land = await connectedFarm.getLand(id);
        return {
          id: Number(land[0]),
          name: land[2],
          fertility: Number(land[3]),
          size: Number(land[4]),
          isPlanted: land[5],
          plantedTime: Number(land[6]),
          harvestTime: Number(land[7]),
          cropType: land[8],
          lastWatered: Number(land[9])
        };
      });
      
      const landData = await Promise.all(landPromises);
      setLands(landData);
    } catch (err) {
      console.error("Failed to load lands:", err);
      setError("Failed to load your land plots");
    } finally {
      setLoading(false);
    }
  };

  // Load user's resources
  const loadResources = async () => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      // Get resources
      const resourceData = await connectedFarm.getPlayerResources(account);
      
      setResources({
        wool: Number(resourceData[0]),
        seeds: Number(resourceData[1]),
        crops: Number(resourceData[2])
      });
    } catch (err) {
      console.error("Failed to load resources:", err);
      setError("Failed to load your resources");
    } finally {
      setLoading(false);
    }
  };

  // Mint a new alpaca
  const mintAlpaca = async (name: string) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      // Check if this is the first alpaca (free) or not
      const balance = await connectedFarm.balanceOf(account);
      const value = balance > 0 ? ethers.parseEther("0.05") : 0;
      
      const tx = await connectedFarm.mintAlpaca(name, { value });
      await tx.wait();
      
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to mint alpaca:", err);
      setError("Failed to mint alpaca");
    } finally {
      setLoading(false);
    }
  };

  // Feed an alpaca
  const feedAlpaca = async (tokenId: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.feedAlpaca(tokenId);
      await tx.wait();
      
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to feed alpaca:", err);
      setError("Failed to feed alpaca");
    } finally {
      setLoading(false);
    }
  };

  // Groom an alpaca
  const groomAlpaca = async (tokenId: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.groomAlpaca(tokenId);
      await tx.wait();
      
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to groom alpaca:", err);
      setError("Failed to groom alpaca");
    } finally {
      setLoading(false);
    }
  };

  // Shear an alpaca
  const shearAlpaca = async (tokenId: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.shearAlpaca(tokenId);
      await tx.wait();
      
      await loadAlpacas();
      await loadResources();
    } catch (err) {
      console.error("Failed to shear alpaca:", err);
      setError("Failed to shear alpaca");
    } finally {
      setLoading(false);
    }
  };

  // Breed two alpacas
  const breedAlpacas = async (alpaca1Id: number, alpaca2Id: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      // Get breeding fee
      const breedingFee = await connectedFarm.breedingFee();
      
      const tx = await connectedFarm.breedAlpacas(alpaca1Id, alpaca2Id, { value: breedingFee });
      await tx.wait();
      
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to breed alpacas:", err);
      setError("Failed to breed alpacas");
    } finally {
      setLoading(false);
    }
  };

  // Buy a land plot
  const buyLandPlot = async (name: string) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.buyLandPlot(name, { value: ethers.parseEther("0.05") });
      await tx.wait();
      
      await loadLands();
    } catch (err) {
      console.error("Failed to buy land plot:", err);
      setError("Failed to buy land plot");
    } finally {
      setLoading(false);
    }
  };

  // Plant crops on land
  const plantCrops = async (landId: number, cropType: string) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.plantCrops(landId, cropType);
      await tx.wait();
      
      await loadLands();
      await loadResources();
    } catch (err) {
      console.error("Failed to plant crops:", err);
      setError("Failed to plant crops");
    } finally {
      setLoading(false);
    }
  };

  // Water crops
  const waterCrops = async (landId: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.waterCrops(landId);
      await tx.wait();
      
      await loadLands();
    } catch (err) {
      console.error("Failed to water crops:", err);
      setError("Failed to water crops");
    } finally {
      setLoading(false);
    }
  };

  // Harvest crops
  const harvestCrops = async (landId: number, alpacaId: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.harvestCrops(landId, alpacaId);
      await tx.wait();
      
      await loadLands();
      await loadAlpacas();
      await loadResources();
    } catch (err) {
      console.error("Failed to harvest crops:", err);
      setError("Failed to harvest crops");
    } finally {
      setLoading(false);
    }
  };

  // Convert crops to seeds
  const convertCropsToSeeds = async (amount: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.convertCropsToSeeds(amount);
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to convert crops to seeds:", err);
      setError("Failed to convert crops to seeds");
    } finally {
      setLoading(false);
    }
  };

  // Buy seeds
  const buySeeds = async (amount: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.buySeeds(amount, { value: ethers.parseEther((0.001 * amount).toString()) });
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to buy seeds:", err);
      setError("Failed to buy seeds");
    } finally {
      setLoading(false);
    }
  };

  // Sell wool
  const sellWool = async (amount: number) => {
    if (!account || !farmContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedFarm = farmContract.connect(signer);
      
      const tx = await connectedFarm.sellWool(amount);
      await tx.wait();
      
      await loadResources();
    } catch (err) {
      console.error("Failed to sell wool:", err);
      setError("Failed to sell wool");
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

  // List an alpaca for sale
  const listAlpaca = async (tokenId: number, price: string) => {
    if (!account || !marketContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedMarket = marketContract.connect(signer);
      
      const priceInWei = ethers.parseEther(price);
      const tx = await connectedMarket.listAlpaca(tokenId, priceInWei);
      await tx.wait();
      
      await loadListings();
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to list alpaca:", err);
      setError("Failed to list alpaca for sale");
    } finally {
      setLoading(false);
    }
  };

  // Buy an alpaca
  const buyAlpaca = async (tokenId: number, price: string) => {
    if (!account || !marketContract || !provider) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const signer = await provider.getSigner();
      const connectedMarket = marketContract.connect(signer);
      
      const priceInWei = ethers.parseEther(price);
      const tx = await connectedMarket.buyAlpaca(tokenId, { value: priceInWei });
      await tx.wait();
      
      await loadListings();
      await loadAlpacas();
    } catch (err) {
      console.error("Failed to buy alpaca:", err);
      setError("Failed to buy alpaca");
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
          setAlpacas([]);
          setLands([]);
          setResources({ wool: 0, seeds: 0, crops: 0 });
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
      loadAlpacas();
      loadLands();
      loadResources();
      loadListings();
    }
  }, [account]);

  const value = {
    account,
    connectWallet,
    alpacas,
    lands,
    resources,
    loadAlpacas,
    loadLands,
    loadResources,
    mintAlpaca,
    feedAlpaca,
    groomAlpaca,
    shearAlpaca,
    breedAlpacas,
    buyLandPlot,
    plantCrops,
    waterCrops,
    harvestCrops,
    convertCropsToSeeds,
    buySeeds,
    sellWool,
    listAlpaca,
    buyAlpaca,
    cancelListing,
    listings,
    loadListings,
    loading,
    error
  };

  return (
    <AlpacaContext.Provider value={value}>
      {children}
    </AlpacaContext.Provider>
  );
};