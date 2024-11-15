const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '../contracts/TicketSale.sol');
const sourceCode = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'TicketSale.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check if there were any errors
if (output.errors) {
  output.errors.forEach(error => {
    console.error(error.formattedMessage);
  });
}

// Get the contract
const contract = output.contracts['TicketSale.sol']['TicketSale'];

// Export the interface (ABI) and bytecode
module.exports = {
  interface: JSON.stringify(contract.abi),
  bytecode: contract.evm.bytecode.object
};