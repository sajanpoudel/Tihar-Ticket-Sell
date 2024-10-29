# Tihar Festival Ticket Sale Platform

A decentralized ticket sale platform built on Ethereum (Sepolia testnet) that enables secure ticket purchasing, swapping, and reselling with automated service fee handling. The platform features a beautiful Tihar Festival-themed UI with dark/light mode support.


## 📁 Project Structure
```
ticket-sale-platform/
├── contracts/
│   └── TicketSale.sol         # Smart contract
├── pages/
│   ├── _app.js               # Next.js app wrapper
│   └── index.js              # Main UI page
├── styles/
│   ├── globals.css           # Global styles
│   └── Home.module.css       # Component styles
├── scripts/
│   ├── compile.js            # Contract compilation
│   └── deploy.js             # Contract deployment
├── artifacts/                # Compiled contract files
├── .env                      # Environment variables
├── config.json              # Contract configuration
├── hardhat.config.js        # Hardhat configuration
└── package.json             # Project dependencies
```

## �� Tech Stack

### Blockchain
- Solidity ^0.8.17 (Smart Contract)
- Hardhat (Development Environment)
- Ethers.js v5.7.2 (Blockchain Interaction)
- Web3Modal (Wallet Connection)
- Sepolia Testnet

### Frontend
- Next.js 15.0.2
- React 18.3.1
- CSS Modules
- Web3.js

## 📋 Prerequisites

1. Node.js (v14 or higher)
2. MetaMask wallet
3. Sepolia testnet ETH
4. Infura account

## 🔧 Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ticket-sale-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Setup:**

Create a .env file in the root directory:
```env
INFURA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
MANAGER_ADDRESS=YOUR_MANAGER_WALLET_ADDRESS
```

Where to get these values:
- INFURA_URL: 
  1. Sign up at infura.io
  2. Create new project
  3. Select Sepolia network
  4. Copy the HTTPS endpoint

- PRIVATE_KEY:
  1. Open MetaMask
  2. Click three dots → Account Details
  3. Export Private Key
  4. Copy the key (never share this!)

- MANAGER_ADDRESS:
  1. Your MetaMask wallet address
  2. This will be the contract manager

4. **Compile the contract:**
```bash
npx hardhat clean
npx hardhat compile
```

5. **Deploy to Sepolia:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Example output:
```bash
sajanpoudel@iPhone Ticket-Sale-Contract % npx hardhat run scripts/deploy.js --network sepolia
Deploying contracts with account: 0x60776F9B7B8F8060Bc24c1F29D46FC532a71b343
Deploying with options: {
  numTickets: 100,
  ticketPrice: '0.001',
  gasLimit: 8000000,
  gasPrice: '1774917942'
}
TicketSale deployed to: 0x408c5313592161d69Ae7acbca2A9b744FB6aBB9a
Contract deployed with:
- Number of tickets: 100
- Ticket price: 0.001 ETH
- Manager address: 0x60776F9B7B8F8060Bc24c1F29D46FC532a71b343

```

6. **Test the contract:**
```bash
npx hardhat test
```


  TicketSale Contract
    Deployment
      ✔ Should set the right owner
      ✔ Should set the correct ticket price
      ✔ Should set the correct number of tickets
    Ticket Purchase
      ✔ Should allow buying a ticket
      ✔ Should not allow buying with incorrect price
      ✔ Should not allow buying same ticket twice
      ✔ Should not allow buying multiple tickets
    Ticket Swapping
      ✔ Should allow offering a swap
      ✔ Should allow accepting a swap
      ✔ Should not allow swap without ownership
    Ticket Resale
      ✔ Should allow listing ticket for resale
      ✔ Should allow buying resale ticket
      ✔ Should transfer service fee to manager
    Manager Functions
      ✔ Should allow manager to update ticket price
      ✔ Should allow manager to add tickets
      ✔ Should not allow non-manager to update price


  16 passing (1s)
```

6. **Update Configuration:**

After deployment, you'll get a contract address. Update these files:

config.json:
```json
{
  "contractAddress": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
  "numTickets": 100,
  "ticketPrice": "1000000000000000",
  "deployedAt": "2024-10-29T22:31:49.475Z",
  "network": "sepolia",
  "managerAddress": "YOUR_MANAGER_ADDRESS"
}
```

pages/index.js:
```javascript
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

7. **Start the development server:**
```bash
npm run dev
```

## 🎫 Smart Contract Functions

### User Functions
- `buyTicket(uint ticketId)`: Purchase a ticket
- `getTicketOf(address person)`: Check ticket ownership
- `offerSwap(uint ticketId)`: Offer to swap tickets
- `acceptSwap(uint ticketId)`: Accept a swap offer
- `resaleTicket(uint price)`: List ticket for resale
- `acceptResale(uint ticketId)`: Buy a resale ticket

### Manager Functions
- `updateTicketPrice(uint newPrice)`: Update ticket price
- `addTickets(uint additionalTickets)`: Add more tickets
- `getTotalAvailableTickets()`: Check available tickets

## 🎨 UI Features

### Theme
- Tihar Festival theme
- Dark/light mode
- Festival animations
- Responsive design

### Components
1. **Wallet Connection**
   - MetaMask integration
   - Account display
   - Network validation

2. **Ticket Management**
   - Purchase tickets
   - Swap tickets
   - Resale functionality
   - Ticket validation

3. **Manager Dashboard**
   - Add tickets
   - Update prices
   - View statistics

## 🔐 Security

1. **Environment Variables**
   - Never commit .env file
   - Keep private keys secure
   - Use separate development wallet

2. **Contract Security**
   - One ticket per address
   - Manager-only functions
   - Automated fee handling

## 🌐 Network Setup

1. **Add Sepolia to MetaMask:**
   - Network Name: Sepolia Test Network
   - RPC URL: https://sepolia.infura.io/v3/
   - Chain ID: 11155111
   - Currency Symbol: SepoliaETH
   - Block Explorer: https://sepolia.etherscan.io/

2. **Get Test ETH:**
   - Visit: https://sepoliafaucet.com/
   - Connect wallet
   - Request test ETH

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

## 📱 Deployment

1. **Build for production:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

## 🔍 Troubleshooting

1. **MetaMask Connection Issues:**
   - Ensure Sepolia network is selected
   - Check if you have test ETH
   - Clear MetaMask cache if needed

2. **Transaction Failures:**
   - Check gas prices
   - Verify contract address
   - Ensure sufficient balance

3. **UI Issues:**
   - Clear browser cache
   - Check console for errors
   - Verify contract connection

## 📱 Application Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.19.52%E2%80%AFPM.png" alt="Connect Wallet" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Connect Wallet Interface</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/available-tickets.png" alt="Available Tickets" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Available Tickets Display</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/ticket-management.png" alt="Ticket Management" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Ticket Management Interface</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/swap-interface.png" alt="Swap Interface" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Ticket Swap Interface</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/resale-section.png" alt="Resale Section" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Ticket Resale Section</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/manager-controls.png" alt="Manager Controls" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Manager Control Panel</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/dark-mode.png" alt="Dark Mode" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Dark Mode Theme</strong></p>
</div>

<div style="width: 45%; min-width: 300px; margin-bottom: 20px;">
    <img src="images/transaction-history.png" alt="Transaction History" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <p align="center"><strong>Transaction History</strong></p>
</div>

</div>

## 🎯 Features Demonstrated in Screenshots

1. **Connect Wallet Interface**
   - MetaMask integration
   - Network validation
   - Account display

2. **Available Tickets Display**
   - Day-based categorization
   - Price information
   - Ticket availability status

3. **Ticket Management Interface**
   - Owned ticket display
   - Ticket details
   - Management options

4. **Ticket Swap Interface**
   - Swap offer creation
   - Swap acceptance
   - Current offers display

5. **Ticket Resale Section**
   - Price setting
   - Available resale tickets
   - Purchase interface

6. **Manager Control Panel**
   - Price updates
   - Ticket addition
   - Statistics overview

7. **Dark Mode Theme**
   - Theme toggle
   - Improved visibility
   - Festival-themed elements

8. **Transaction History**
   - Recent activities
   - Transaction details
   - Status tracking
