require('dotenv').config();
const { ethers } = require('hardhat');
const hre = require("hardhat");
const fs = require('fs-extra');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const ticketPrice = hre.ethers.utils.parseEther("0.001"); // 0.001 ETH
  const numTickets = 100;

  const deploymentOptions = {
    numTickets,
    ticketPrice: hre.ethers.utils.formatEther(ticketPrice),
    gasLimit: 8000000,
    gasPrice: await hre.ethers.provider.getGasPrice()
  };

  console.log("Deploying with options:", deploymentOptions);

  const TicketSale = await hre.ethers.getContractFactory("TicketSale");
  const ticketSale = await TicketSale.deploy(numTickets, ticketPrice);
  await ticketSale.deployed();

  console.log("TicketSale deployed to:", ticketSale.address);

  // Update config.json with new contract address
  const configPath = path.join(__dirname, '../config.json');
  const config = await fs.readJson(configPath);
  
  config.contractAddress = ticketSale.address;
  config.deployedAt = new Date().toISOString();
  config.managerAddress = deployer.address;
  
  await fs.writeJson(configPath, config, { spaces: 2 });

  console.log("Contract deployed with:");
  console.log("- Number of tickets:", numTickets);
  console.log("- Ticket price:", hre.ethers.utils.formatEther(ticketPrice), "ETH");
  console.log("- Manager address:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
