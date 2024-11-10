# Tihar Festival Ticket Sale Platform - Festival of Joy

A decentralized ticket sale platform built on Ethereum (Sepolia testnet) that enables secure ticket purchasing, swapping, and reselling with automated service fee handling. The platform features a beautiful Tihar Festival-themed UI with dark/light mode support.


## 📁 Project Structure
```
Tihar-Ticket-Sell/
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

## 📱 Application Preview

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px;">

<div style="width: 90%; background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <h3 style="text-align: center; margin-bottom: 15px;">Wallet Connection & Dashboard</h3>
    <div style="display: flex; gap: 20px; justify-content: center;">
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.19.52%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.23.44%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
    </div>
    <p style="text-align: center; margin-top: 10px;">Connect wallet interface and main dashboard view</p>
</div>

<div style="width: 90%; background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <h3 style="text-align: center; margin-bottom: 15px;">Ticket Management</h3>
    <div style="display: flex; gap: 20px; justify-content: center;">
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.26.21%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.27.15%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
    </div>
    <p style="text-align: center; margin-top: 10px;">Ticket management interface and swap functionality</p>
</div>

<div style="width: 90%; background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <h3 style="text-align: center; margin-bottom: 15px;">Resale & Manager Controls</h3>
    <div style="display: flex; gap: 20px; justify-content: center;">
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.27.38%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.30.02%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
    </div>
    <p style="text-align: center; margin-top: 10px;">Ticket resale system and manager control panel</p>
</div>

<div style="width: 90%; background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <h3 style="text-align: center; margin-bottom: 15px;">Theme Support</h3>
    <div style="display: flex; gap: 20px; justify-content: center;">
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.32.12%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
        <img src="https://github.com/sajanpoudel/Tihar-Ticket-Sell/blob/main/images/Screenshot%202024-10-29%20at%207.32.12%E2%80%AFPM.png" width="48%" style="border-radius: 8px;" />
    </div>
    <p style="text-align: center; margin-top: 10px;"></p>
</div>

</div>



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
cd Tihar-Ticket-Sell
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

## 🧪 Testing with Ganache

The project uses Ganache for local blockchain testing. Here's how to run the tests:

1. **Install Dependencies:**
```bash
npx hardhat test


2. **Test File Structure:**
```
test/
└── ganache.js    # Main test file using Ganache
```

3. **Test Cases:**
The test suite (`test/ganache.js`) includes:
- Contract deployment verification
- Ticket purchase functionality
- Ticket swap mechanism
- Resale functionality
- Payment transfer verification
- Service fee handling

4. **Run Tests:**
```bash
node scripts/compile.js
npm test
```

Example output:
```bash
  
  TicketSale Contract
    ✔ deploys a contract
Buyer initial balance: 1000000000000000000000
    ✔ allows one account to buy a ticket
    ✔ prevents buying same ticket twice
    ✔ allows ticket swap between two users
    ✔ allows resale of tickets
Owner balance change: 0.1 ETH
Buyer balance change: 0.10021951218866495 ETH
    ✔ transfers payment to owner when ticket is purchased
Owner received (service fee): 0.015 ETH
Seller received: 0.135 ETH
Actual seller balance change: 0.135 ETH
Listing gas cost: 0.000094512 ETH
Buyer paid: 0.150189007503689088 ETH
    ✔ transfers payment correctly during resale with service fee


  7 passing (191ms)
```

5. **Key Test Features:**
- Uses Ganache's in-memory blockchain
- Preconfigured test accounts with 1000 ETH each
- Automated gas limit settings
- Balance tracking for payment verification
- Service fee calculations
- Transaction cost monitoring

6. **Test Environment Configuration:**
```javascript
const provider = ganache.provider({
  accounts: [
    { balance: '1000000000000000000000' },  // Account 0 (deployer)
    { balance: '1000000000000000000000' },  // Account 1 (buyer)
    { balance: '1000000000000000000000' },  // Account 2 (another buyer)
    { balance: '1000000000000000000000' }   // Account 3 (extra account)
  ],
  gasLimit: 8000000
});
```

7. **Verification Points:**
- Contract deployment success
- Ticket ownership transfers
- Payment transfers to owner
- Service fee calculations
- Balance changes for all parties
- Gas cost tracking
- Error handling

8. **Troubleshooting Tests:**
- If tests fail with "out of gas" error, increase the gasLimit
- For balance assertion failures, check the gas cost calculations
- For transaction failures, verify the contract state before each operation


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

## Running the contract tests

The tests compile `contracts/TicketSale.sol` with `solc` and run it on an in memory Ganache chain, so no wallet or network is needed.

```
npm install
npm test
```

They cover buying, swapping, resale with the 10 percent service fee, and the rules that a wallet can hold only one ticket and that a swap needs a ticket with an owner.
