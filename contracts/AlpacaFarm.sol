// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AlpacaFarm is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Alpaca attributes
    struct Alpaca {
        string name;
        uint256 dna;
        uint8 level;
        uint8 rarity;
        uint256 lastFed;
        uint256 lastGroomed;
        uint256 breedingCooldown;
        uint256 wool;
        uint256 lastSheared;
        uint8 happiness;
        uint8 energy;
        uint8 farmingSkill;
    }
    
    // Land plot structure
    struct LandPlot {
        uint256 id;
        address owner;
        string name;
        uint8 fertility;
        uint8 size;
        bool isPlanted;
        uint256 plantedTime;
        uint256 harvestTime;
        string cropType;
        uint256 lastWatered;
    }
    
    // Resources
    mapping(address => uint256) public woolBalance;
    mapping(address => uint256) public seedBalance;
    mapping(address => uint256) public cropBalance;
    
    // Land plots
    mapping(uint256 => LandPlot) public landPlots;
    Counters.Counter private _landIds;
    mapping(address => uint256[]) private _ownedLands;
    
    // Mapping from token ID to Alpaca
    mapping(uint256 => Alpaca) public alpacas;
    
    // Breeding fee in wei
    uint256 public breedingFee = 0.01 ether;
    
    // Land plot price
    uint256 public landPlotPrice = 0.05 ether;
    
    // Cooldown time for breeding (24 hours)
    uint256 public breedingCooldownTime = 1 days;
    
    // Cooldown time for shearing (3 days)
    uint256 public shearingCooldownTime = 3 days;
    
    // Crop growth time (12 hours)
    uint256 public cropGrowthTime = 12 hours;
    
    // Events
    event AlpacaMinted(address owner, uint256 tokenId, string name, uint256 dna);
    event AlpacaFed(uint256 tokenId, uint256 timestamp);
    event AlpacaGroomed(uint256 tokenId, uint256 timestamp);
    event AlpacaBred(uint256 parent1Id, uint256 parent2Id, uint256 childId);
    event AlpacaSheared(uint256 tokenId, uint256 woolAmount);
    event LandPurchased(address owner, uint256 landId, string name);
    event CropPlanted(uint256 landId, string cropType);
    event CropWatered(uint256 landId);
    event CropHarvested(uint256 landId, uint256 cropAmount);
    
    constructor() ERC721("AlpacaFarm", "ALPACA") Ownable(msg.sender) {}
    
    // Generate random DNA
    function _generateRandomDna(string memory _name) internal view returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(_name, block.timestamp, msg.sender)));
        return rand % 10**16; // 16 digits
    }
    
    // Mint a new Alpaca (first one is free, others cost ETH)
    function mintAlpaca(string memory _name) external payable {
        if (balanceOf(msg.sender) > 0) {
            require(msg.value >= 0.05 ether, "Minting fee required after first alpaca");
        }
        
        uint256 dna = _generateRandomDna(_name);
        uint8 rarity = uint8((dna % 100) + 1); // 1-100 rarity
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        alpacas[newItemId] = Alpaca({
            name: _name,
            dna: dna,
            level: 1,
            rarity: rarity,
            lastFed: block.timestamp,
            lastGroomed: block.timestamp,
            breedingCooldown: 0,
            wool: 0,
            lastSheared: block.timestamp,
            happiness: 50,
            energy: 100,
            farmingSkill: 1
        });
        
        _safeMint(msg.sender, newItemId);
        
        emit AlpacaMinted(msg.sender, newItemId, _name, dna);
    }
    
    // Feed your Alpaca (increases happiness/health)
    function feedAlpaca(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(block.timestamp > alpacas[_tokenId].lastFed + 4 hours, "Already fed recently");
        
        alpacas[_tokenId].lastFed = block.timestamp;
        
        // Increase happiness and energy
        if (alpacas[_tokenId].happiness < 95) {
            alpacas[_tokenId].happiness += 5;
        } else {
            alpacas[_tokenId].happiness = 100;
        }
        
        if (alpacas[_tokenId].energy < 90) {
            alpacas[_tokenId].energy += 10;
        } else {
            alpacas[_tokenId].energy = 100;
        }
        
        // Level up if conditions met
        if (block.timestamp > alpacas[_tokenId].lastFed + 7 days && 
            block.timestamp > alpacas[_tokenId].lastGroomed + 7 days) {
            if (alpacas[_tokenId].level < 100) {
                alpacas[_tokenId].level++;
            }
        }
        
        emit AlpacaFed(_tokenId, block.timestamp);
    }
    
    // Groom your Alpaca (increases happiness)
    function groomAlpaca(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(block.timestamp > alpacas[_tokenId].lastGroomed + 12 hours, "Already groomed recently");
        
        alpacas[_tokenId].lastGroomed = block.timestamp;
        
        // Increase happiness
        if (alpacas[_tokenId].happiness < 90) {
            alpacas[_tokenId].happiness += 10;
        } else {
            alpacas[_tokenId].happiness = 100;
        }
        
        emit AlpacaGroomed(_tokenId, block.timestamp);
    }
    
    // Shear your Alpaca (collect wool)
    function shearAlpaca(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(block.timestamp > alpacas[_tokenId].lastSheared + shearingCooldownTime, "Cannot shear yet");
        
        // Calculate wool amount based on rarity and happiness
        uint256 woolAmount = (alpacas[_tokenId].rarity / 10) + (alpacas[_tokenId].happiness / 20) + 1;
        
        // Add wool to player's balance
        woolBalance[msg.sender] += woolAmount;
        
        // Reset shearing cooldown
        alpacas[_tokenId].lastSheared = block.timestamp;
        
        // Decrease happiness slightly
        if (alpacas[_tokenId].happiness > 10) {
            alpacas[_tokenId].happiness -= 10;
        } else {
            alpacas[_tokenId].happiness = 1;
        }
        
        // Increase farming skill
        if (alpacas[_tokenId].farmingSkill < 100) {
            alpacas[_tokenId].farmingSkill++;
        }
        
        emit AlpacaSheared(_tokenId, woolAmount);
    }
    
    // Breed two Alpacas to create a new one
    function breedAlpacas(uint256 _alpaca1Id, uint256 _alpaca2Id) external payable {
        require(ownerOf(_alpaca1Id) == msg.sender, "Not the owner of first alpaca");
        require(ownerOf(_alpaca2Id) == msg.sender, "Not the owner of second alpaca");
        require(_alpaca1Id != _alpaca2Id, "Cannot breed with self");
        require(msg.value >= breedingFee, "Breeding fee required");
        
        Alpaca storage alpaca1 = alpacas[_alpaca1Id];
        Alpaca storage alpaca2 = alpacas[_alpaca2Id];
        
        require(block.timestamp > alpaca1.breedingCooldown, "First alpaca in cooldown");
        require(block.timestamp > alpaca2.breedingCooldown, "Second alpaca in cooldown");
        require(alpaca1.level >= 5, "First alpaca level too low");
        require(alpaca2.level >= 5, "Second alpaca level too low");
        require(alpaca1.energy >= 50, "First alpaca energy too low");
        require(alpaca2.energy >= 50, "Second alpaca energy too low");
        
        // Set breeding cooldown
        alpaca1.breedingCooldown = block.timestamp + breedingCooldownTime;
        alpaca2.breedingCooldown = block.timestamp + breedingCooldownTime;
        
        // Decrease energy
        alpaca1.energy -= 50;
        alpaca2.energy -= 50;
        
        // Create child DNA (mix of parents with mutation)
        uint256 childDna = (alpaca1.dna + alpaca2.dna) / 2;
        
        // Add small mutation
        if (uint256(keccak256(abi.encodePacked(block.timestamp))) % 100 < 25) {
            childDna = childDna + uint256(keccak256(abi.encodePacked(block.timestamp))) % 10;
        }
        
        // Create child name
        string memory childName = string(abi.encodePacked("Baby ", alpaca1.name));
        
        // Calculate child rarity (chance for higher rarity than parents)
        uint8 maxParentRarity = alpaca1.rarity > alpaca2.rarity ? alpaca1.rarity : alpaca2.rarity;
        uint8 childRarity = maxParentRarity;
        
        // 10% chance for higher rarity
        if (uint256(keccak256(abi.encodePacked(block.timestamp, childDna))) % 100 < 10) {
            childRarity = uint8(maxParentRarity + 5 > 100 ? 100 : maxParentRarity + 5);
        }
        
        // Calculate farming skill (average of parents with small bonus)
        uint8 avgFarmingSkill = (alpaca1.farmingSkill + alpaca2.farmingSkill) / 2;
        uint8 childFarmingSkill = avgFarmingSkill;
        
        // 20% chance for better farming skill
        if (uint256(keccak256(abi.encodePacked(block.timestamp, childDna, "skill"))) % 100 < 20) {
            childFarmingSkill = uint8(avgFarmingSkill + 2 > 100 ? 100 : avgFarmingSkill + 2);
        }
        
        // Mint new alpaca
        _tokenIds.increment();
        uint256 childId = _tokenIds.current();
        
        alpacas[childId] = Alpaca({
            name: childName,
            dna: childDna,
            level: 1,
            rarity: childRarity,
            lastFed: block.timestamp,
            lastGroomed: block.timestamp,
            breedingCooldown: 0,
            wool: 0,
            lastSheared: block.timestamp,
            happiness: 80,
            energy: 100,
            farmingSkill: childFarmingSkill
        });
        
        _safeMint(msg.sender, childId);
        
        emit AlpacaBred(_alpaca1Id, _alpaca2Id, childId);
    }
    
    // Buy a land plot
    function buyLandPlot(string memory _name) external payable {
        require(msg.value >= landPlotPrice, "Insufficient payment");
        
        // Generate random fertility and size
        uint8 fertility = uint8(uint256(keccak256(abi.encodePacked(_name, block.timestamp, msg.sender))) % 100) + 1;
        uint8 size = uint8(uint256(keccak256(abi.encodePacked(_name, block.timestamp + 1, msg.sender))) % 5) + 1;
        
        _landIds.increment();
        uint256 landId = _landIds.current();
        
        landPlots[landId] = LandPlot({
            id: landId,
            owner: msg.sender,
            name: _name,
            fertility: fertility,
            size: size,
            isPlanted: false,
            plantedTime: 0,
            harvestTime: 0,
            cropType: "",
            lastWatered: 0
        });
        
        _ownedLands[msg.sender].push(landId);
        
        emit LandPurchased(msg.sender, landId, _name);
    }
    
    // Plant crops on land
    function plantCrops(uint256 _landId, string memory _cropType) external {
        require(landPlots[_landId].owner == msg.sender, "Not the owner of this land");
        require(!landPlots[_landId].isPlanted, "Land already planted");
        require(seedBalance[msg.sender] > 0, "No seeds available");
        
        LandPlot storage land = landPlots[_landId];
        
        // Use seeds
        seedBalance[msg.sender]--;
        
        // Plant crops
        land.isPlanted = true;
        land.plantedTime = block.timestamp;
        land.harvestTime = block.timestamp + cropGrowthTime;
        land.cropType = _cropType;
        land.lastWatered = block.timestamp;
        
        emit CropPlanted(_landId, _cropType);
    }
    
    // Water crops
    function waterCrops(uint256 _landId) external {
        require(landPlots[_landId].owner == msg.sender, "Not the owner of this land");
        require(landPlots[_landId].isPlanted, "No crops planted");
        require(block.timestamp < landPlots[_landId].harvestTime, "Crops ready for harvest");
        require(block.timestamp > landPlots[_landId].lastWatered + 4 hours, "Already watered recently");
        
        LandPlot storage land = landPlots[_landId];
        
        // Watering reduces growth time by 1 hour
        if (land.harvestTime > block.timestamp + 1 hours) {
            land.harvestTime -= 1 hours;
        }
        
        land.lastWatered = block.timestamp;
        
        emit CropWatered(_landId);
    }
    
    // Harvest crops
    function harvestCrops(uint256 _landId, uint256 _alpacaId) external {
        require(landPlots[_landId].owner == msg.sender, "Not the owner of this land");
        require(ownerOf(_alpacaId) == msg.sender, "Not the owner of this alpaca");
        require(landPlots[_landId].isPlanted, "No crops planted");
        require(block.timestamp >= landPlots[_landId].harvestTime, "Crops not ready yet");
        
        LandPlot storage land = landPlots[_landId];
        Alpaca storage alpaca = alpacas[_alpacaId];
        
        // Calculate crop yield based on land fertility, size, and alpaca farming skill
        uint256 cropYield = (land.fertility / 10) + land.size + (alpaca.farmingSkill / 10);
        
        // Add crops to player's balance
        cropBalance[msg.sender] += cropYield;
        
        // Reset land
        land.isPlanted = false;
        land.plantedTime = 0;
        land.harvestTime = 0;
        land.cropType = "";
        
        // Increase alpaca farming skill
        if (alpaca.farmingSkill < 100) {
            alpaca.farmingSkill++;
        }
        
        // Decrease alpaca energy
        if (alpaca.energy > 20) {
            alpaca.energy -= 20;
        } else {
            alpaca.energy = 1;
        }
        
        // Add some seeds back (farming produces seeds)
        seedBalance[msg.sender] += cropYield / 4 + 1;
        
        emit CropHarvested(_landId, cropYield);
    }
    
    // Convert crops to seeds
    function convertCropsToSeeds(uint256 _amount) external {
        require(cropBalance[msg.sender] >= _amount, "Not enough crops");
        
        cropBalance[msg.sender] -= _amount;
        seedBalance[msg.sender] += _amount / 2 + 1; // 2 crops = 1 seed + bonus
    }
    
    // Buy seeds with ETH
    function buySeeds(uint256 _amount) external payable {
        require(msg.value >= 0.001 ether * _amount, "Insufficient payment");
        
        seedBalance[msg.sender] += _amount;
    }
    
    // Sell wool for ETH
    function sellWool(uint256 _amount) external {
        require(woolBalance[msg.sender] >= _amount, "Not enough wool");
        
        woolBalance[msg.sender] -= _amount;
        
        // Calculate ETH to send (0.002 ETH per wool)
        uint256 ethAmount = 0.002 ether * _amount;
        
        // Send ETH to seller
        (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
        require(success, "Transfer failed");
    }
    
    // Get all alpacas owned by an address
    function getAlpacasByOwner(address _owner) external view returns (uint256[] memory) {
        uint256 alpacaCount = balanceOf(_owner);
        uint256[] memory result = new uint256[](alpacaCount);
        
        for (uint256 i = 0; i < alpacaCount; i++) {
            result[i] = tokenOfOwnerByIndex(_owner, i);
        }
        
        return result;
    }
    
    // Get all land plots owned by an address
    function getLandsByOwner(address _owner) external view returns (uint256[] memory) {
        return _ownedLands[_owner];
    }
    
    // Get alpaca details
    function getAlpaca(uint256 _tokenId) external view returns (
        string memory name,
        uint256 dna,
        uint8 level,
        uint8 rarity,
        uint256 lastFed,
        uint256 lastGroomed,
        uint256 breedingCooldown,
        uint256 wool,
        uint256 lastSheared,
        uint8 happiness,
        uint8 energy,
        uint8 farmingSkill
    ) {
        Alpaca storage alpaca = alpacas[_tokenId];
        return (
            alpaca.name,
            alpaca.dna,
            alpaca.level,
            alpaca.rarity,
            alpaca.lastFed,
            alpaca.lastGroomed,
            alpaca.breedingCooldown,
            alpaca.wool,
            alpaca.lastSheared,
            alpaca.happiness,
            alpaca.energy,
            alpaca.farmingSkill
        );
    }
    
    // Get land details
    function getLand(uint256 _landId) external view returns (
        uint256 id,
        address owner,
        string memory name,
        uint8 fertility,
        uint8 size,
        bool isPlanted,
        uint256 plantedTime,
        uint256 harvestTime,
        string memory cropType,
        uint256 lastWatered
    ) {
        LandPlot storage land = landPlots[_landId];
        return (
            land.id,
            land.owner,
            land.name,
            land.fertility,
            land.size,
            land.isPlanted,
            land.plantedTime,
            land.harvestTime,
            land.cropType,
            land.lastWatered
        );
    }
    
    // Get player resources
    function getPlayerResources(address _player) external view returns (
        uint256 wool,
        uint256 seeds,
        uint256 crops
    ) {
        return (
            woolBalance[_player],
            seedBalance[_player],
            cropBalance[_player]
        );
    }
    
    // Update breeding fee (owner only)
    function setBreedingFee(uint256 _fee) external onlyOwner {
        breedingFee = _fee;
    }
    
    // Update land plot price (owner only)
    function setLandPlotPrice(uint256 _price) external onlyOwner {
        landPlotPrice = _price;
    }
    
    // Withdraw contract balance (owner only)
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}