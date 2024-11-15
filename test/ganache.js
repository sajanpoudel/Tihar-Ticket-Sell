const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');

// Configure ganache with multiple accounts and sufficient balance
const provider = ganache.provider({
  accounts: [
    { balance: '1000000000000000000000' },  // Account 0 (deployer)
    { balance: '1000000000000000000000' },  // Account 1 (buyer)
    { balance: '1000000000000000000000' },  // Account 2 (another buyer)
    { balance: '1000000000000000000000' }   // Account 3 (extra account)
  ],
  gasLimit: 8000000,
  logging: {
    quiet: true
  }
});

const web3 = new Web3(provider);
const { interface, bytecode } = require('../scripts/compile');

let accounts;
let ticketSale;
const TICKET_PRICE = web3.utils.toWei('0.1', 'ether');

beforeEach(async () => {
  // Get accounts
  accounts = await web3.eth.getAccounts();
  
  try {
    // Deploy contract
    ticketSale = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: [10, TICKET_PRICE]
      })
      .send({
        from: accounts[0],
        gas: '6000000'
      });
  } catch (error) {
    console.error('Deployment error details:', error);
    throw error;
  }
});

describe('TicketSale Contract', () => {
  it('deploys a contract', () => {
    assert.ok(ticketSale.options.address);
  });

  it('allows one account to buy a ticket', async () => {
    try {
      const initialBalance = await web3.eth.getBalance(accounts[1]);
      console.log('Buyer initial balance:', initialBalance);

      await ticketSale.methods.buyTicket(1).send({
        from: accounts[1],
        value: TICKET_PRICE,
        gas: '3000000'
      });

      const ticketOwner = await ticketSale.methods.ticketOwners(1).call();
      assert.equal(ticketOwner, accounts[1]);
    } catch (error) {
      console.error('Buy ticket error:', error);
      throw error;
    }
  });

  it('prevents buying same ticket twice', async () => {
    await ticketSale.methods.buyTicket(1).send({
      from: accounts[1],
      value: TICKET_PRICE,
      gas: '3000000'
    });

    try {
      await ticketSale.methods.buyTicket(1).send({
        from: accounts[2],
        value: TICKET_PRICE,
        gas: '3000000'
      });
      assert(false, 'Should not allow buying same ticket twice');
    } catch (err) {
      assert(err);
    }
  });

  it('allows ticket swap between two users', async () => {
    try {
      // First user buys ticket 1
      await ticketSale.methods.buyTicket(1).send({
        from: accounts[1],
        value: TICKET_PRICE,
        gas: '3000000'
      });

      // Second user buys ticket 2
      await ticketSale.methods.buyTicket(2).send({
        from: accounts[2],
        value: TICKET_PRICE,
        gas: '3000000'
      });

      // First user offers swap for ticket 2
      await ticketSale.methods.offerSwap(2).send({
        from: accounts[1],
        gas: '3000000'
      });

      // Second user accepts swap
      await ticketSale.methods.acceptSwap(1).send({
        from: accounts[2],
        gas: '3000000'
      });

      const ticket1Owner = await ticketSale.methods.ticketOwners(1).call();
      const ticket2Owner = await ticketSale.methods.ticketOwners(2).call();

      assert.equal(ticket1Owner, accounts[2]);
      assert.equal(ticket2Owner, accounts[1]);
    } catch (error) {
      console.error('Swap error details:', error);
      throw error;
    }
  });

  it('allows resale of tickets', async () => {
    try {
      // First user buys ticket
      await ticketSale.methods.buyTicket(1).send({
        from: accounts[1],
        value: TICKET_PRICE,
        gas: '3000000'
      });

      // Get the ticket ID owned by the seller
      const sellerTicketId = await ticketSale.methods.getTicketOf(accounts[1]).call();

      // User offers ticket for resale
      const resalePrice = web3.utils.toWei('0.15', 'ether');
      await ticketSale.methods.resaleTicket(resalePrice).send({
        from: accounts[1],
        gas: '3000000'
      });

      // Another user buys the resale ticket
      await ticketSale.methods.acceptResale(sellerTicketId).send({
        from: accounts[2],
        value: resalePrice,
        gas: '3000000'
      });

      const newOwner = await ticketSale.methods.ticketOwners(sellerTicketId).call();
      assert.equal(newOwner, accounts[2]);
    } catch (error) {
      console.error('Resale error details:', error);
      throw error;
    }
  });

  it('transfers payment to owner when ticket is purchased', async () => {
    try {
      // Get initial balances
      const initialOwnerBalance = BigInt(await web3.eth.getBalance(accounts[0]));
      const initialBuyerBalance = BigInt(await web3.eth.getBalance(accounts[1]));
      
      // Buy ticket
      const transaction = await ticketSale.methods.buyTicket(1).send({
        from: accounts[1],
        value: TICKET_PRICE,
        gas: '3000000'
      });
      
      // Calculate gas cost
      const gasUsed = BigInt(transaction.gasUsed);
      const gasPrice = BigInt(await web3.eth.getGasPrice());
      const gasCost = gasUsed * gasPrice;
      
      // Get final balances
      const finalOwnerBalance = BigInt(await web3.eth.getBalance(accounts[0]));
      const finalBuyerBalance = BigInt(await web3.eth.getBalance(accounts[1]));
      
      // Verify owner received payment
      const ownerDifference = finalOwnerBalance - initialOwnerBalance;
      assert.equal(ownerDifference.toString(), TICKET_PRICE, "Owner should receive ticket payment");
      
      // Verify buyer's balance decreased by ticket price plus gas
      const expectedBuyerDecrease = BigInt(TICKET_PRICE) + gasCost;
      const actualBuyerDecrease = initialBuyerBalance - finalBuyerBalance;
      assert(actualBuyerDecrease >= expectedBuyerDecrease, "Buyer balance should decrease by ticket price plus gas");
      
      console.log('Owner balance change:', web3.utils.fromWei(ownerDifference.toString(), 'ether'), 'ETH');
      console.log('Buyer balance change:', web3.utils.fromWei(actualBuyerDecrease.toString(), 'ether'), 'ETH');
    } catch (error) {
      console.error('Balance transfer error:', error);
      throw error;
    }
  });

  it('transfers payment correctly during resale with service fee', async () => {
    try {
      // First user buys ticket
      const buyTicketTx = await ticketSale.methods.buyTicket(1).send({
        from: accounts[1],
        value: TICKET_PRICE,
        gas: '3000000'
      });

      // Calculate gas cost for initial purchase
      const buyGasUsed = BigInt(buyTicketTx.gasUsed);
      const buyGasPrice = BigInt(await web3.eth.getGasPrice());
      const buyGasCost = buyGasUsed * buyGasPrice;

      // Get balance after initial purchase
      const balanceAfterPurchase = BigInt(await web3.eth.getBalance(accounts[0]));
      const balanceAfterBuy = BigInt(await web3.eth.getBalance(accounts[1]));

      // User offers ticket for resale
      const resalePrice = web3.utils.toWei('0.15', 'ether');
      const resaleListingTx = await ticketSale.methods.resaleTicket(resalePrice).send({
        from: accounts[1],
        gas: '3000000'
      });

      // Calculate gas costs for resale listing
      const listingGasUsed = BigInt(resaleListingTx.gasUsed);
      const listingGasPrice = BigInt(await web3.eth.getGasPrice());
      const listingGasCost = listingGasUsed * listingGasPrice;

      const balanceBeforeResale = BigInt(await web3.eth.getBalance(accounts[1]));
      const initialBuyerBalance = BigInt(await web3.eth.getBalance(accounts[2]));

      // Another user buys the resale ticket
      const resaleTransaction = await ticketSale.methods.acceptResale(1).send({
        from: accounts[2],
        value: resalePrice,
        gas: '3000000'
      });

      // Get final balances
      const finalOwnerBalance = BigInt(await web3.eth.getBalance(accounts[0]));
      const finalSellerBalance = BigInt(await web3.eth.getBalance(accounts[1]));
      const finalBuyerBalance = BigInt(await web3.eth.getBalance(accounts[2]));

      // Calculate expected amounts
      const resalePriceBigInt = BigInt(resalePrice);
      const serviceFee = resalePriceBigInt * BigInt(10) / BigInt(100); // 10% service fee
      const sellerAmount = resalePriceBigInt - serviceFee;

      // Calculate actual differences
      const ownerDifference = finalOwnerBalance - balanceAfterPurchase;
      const sellerDifference = finalSellerBalance - balanceBeforeResale;
      const buyerDifference = initialBuyerBalance - finalBuyerBalance;

      // Verify balances
      assert.equal(ownerDifference.toString(), serviceFee.toString(), "Owner should receive service fee");
      assert.equal(sellerDifference.toString(), sellerAmount.toString(), "Seller should receive resale amount minus service fee");
      
      console.log('Owner received (service fee):', web3.utils.fromWei(ownerDifference.toString(), 'ether'), 'ETH');
      console.log('Seller received:', web3.utils.fromWei(sellerAmount.toString(), 'ether'), 'ETH');
      console.log('Actual seller balance change:', web3.utils.fromWei(sellerDifference.toString(), 'ether'), 'ETH');
      console.log('Listing gas cost:', web3.utils.fromWei(listingGasCost.toString(), 'ether'), 'ETH');
      console.log('Buyer paid:', web3.utils.fromWei(buyerDifference.toString(), 'ether'), 'ETH');
    } catch (error) {
      console.error('Resale balance transfer error:', error);
      throw error;
    }
  });
});