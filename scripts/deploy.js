const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy AlpacaFarm contract
  const AlpacaFarm = await hre.ethers.getContractFactory("AlpacaFarm");
  const alpacaFarm = await AlpacaFarm.deploy();
  await alpacaFarm.waitForDeployment();
  
  const alpacaFarmAddress = await alpacaFarm.getAddress();
  console.log("AlpacaFarm deployed to:", alpacaFarmAddress);

  // Deploy AlpacaMarket contract with AlpacaFarm address
  const AlpacaMarket = await hre.ethers.getContractFactory("AlpacaMarket");
  const alpacaMarket = await AlpacaMarket.deploy(alpacaFarmAddress);
  await alpacaMarket.waitForDeployment();
  
  const alpacaMarketAddress = await alpacaMarket.getAddress();
  console.log("AlpacaMarket deployed to:", alpacaMarketAddress);
  
  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });