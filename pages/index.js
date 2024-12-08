import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import TicketSale from '../artifacts/contracts/TicketSale.sol/TicketSale.json';
import styles from '../styles/Home.module.css';
import config from '../config.json';

const contractAddress = "0x6Aa52E13578D9A710C51eb004ae3d6f9BbCf5A53";

export default function Home() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ownedTicket, setOwnedTicket] = useState(null);
  const [resalePrice, setResalePrice] = useState('');
  const [swapTicketId, setSwapTicketId] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [newTicketPrice, setNewTicketPrice] = useState('');
  const [ticketDays, setTicketDays] = useState({
    Monday: { start: 1, end: 10000 },
    Tuesday: { start: 10001, end: 20000 },
    Wednesday: { start: 20001, end: 30000 },
    Thursday: { start: 30001, end: 40000 },
    Friday: { start: 40001, end: 50000 },
    Weekend: { start: 50001, end: 100000 }
  });
  const [selectedDay, setSelectedDay] = useState('All');
  const [ticketPrice, setTicketPrice] = useState('0');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [newTicketsAmount, setNewTicketsAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [ticketNumberInput, setTicketNumberInput] = useState('');
  const [selectedTicketForResale, setSelectedTicketForResale] = useState('');
  const [selectedTicketForSwap, setSelectedTicketForSwap] = useState('');
  const [desiredTicketForSwap, setDesiredTicketForSwap] = useState('');
  

  useEffect(() => {
    const init = async () => {
      try {
        await initWeb3();
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize Web3. Please make sure you're connected to the correct network.");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      loadAvailableTickets();
      loadTicketPrice();
      if (account) {
        checkIfManager();
        loadOwnedTicket();
      }
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract) {
      const ticketPurchasedFilter = contract.filters.TicketPurchased();
      const ticketSwappedFilter = contract.filters.TicketSwapped();
      const ticketResoldFilter = contract.filters.TicketResold();

      contract.on(ticketPurchasedFilter, (ticketId, buyer) => {
        setEventLogs(prev => [...prev, {
          event: 'Ticket Purchased',
          ticketId: ticketId.toString(),
          buyer,
          timestamp: new Date().toLocaleString()
        }]);
      });

      contract.on(ticketSwappedFilter, (ticket1Id, ticket2Id) => {
        setEventLogs(prev => [...prev, {
          event: 'Ticket Swapped',
          ticket1Id: ticket1Id.toString(),
          ticket2Id: ticket2Id.toString(),
          timestamp: new Date().toLocaleString()
        }]);
      });

      contract.on(ticketResoldFilter, (ticketId, from, to, price) => {
        setEventLogs(prev => [...prev, {
          event: 'Ticket Resold',
          ticketId: ticketId.toString(),
          from,
          to,
          price: ethers.utils.formatEther(price),
          timestamp: new Date().toLocaleString()
        }]);
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract]);

  async function initWeb3() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this application');
      }

      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = accounts[0];

        // Verify network
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111) { // Sepolia chainId
          setError('Please connect to Sepolia network');
          return;
        }

        // Initialize contract
        if (!contractAddress) {
          throw new Error('Contract address not configured');
        }

        const contract = new ethers.Contract(
          contractAddress,
          TicketSale.abi,
          signer
        );

        // Set state
        setContract(contract);
        setAccount(address);
        setProvider(provider);

        // Load initial data
        await loadAvailableTickets();
        await loadResaleTickets();
        await loadTicketPrice();
        
        // Check if user is manager
        if (contract && address) {
          const managerAddress = await contract.manager();
          setIsManager(managerAddress.toLowerCase() === address.toLowerCase());
        }

        // Listen for network changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        // Listen for account changes
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          setError('Please connect your wallet to continue');
        } else if (error.message.includes('user rejected')) {
          setError('Connection rejected. Please try again');
        } else {
          console.error("Connection error:", error);
          setError('Failed to connect. Please try again');
        }
        throw error;
      }

    } catch (error) {
      console.error("Web3 initialization error:", error);
      if (error.code === 4001) {
        setError('Please connect your wallet to continue');
      } else {
        setError(error.message || 'Failed to initialize Web3');
      }
      throw error;
    }
  }

  async function loadAvailableTickets() {
    if (!contract) return;
    setLoading(true);
    try {
      const total = await contract.totalTickets();
      const ticketsList = [];
      
      for(let i = 1; i <= total; i++) {
        const details = await contract.getTicketDetails(i);
        if (details.owner === ethers.constants.AddressZero) {
          ticketsList.push({
            id: i.toString(),
            owner: details.owner,
            isForSale: details.isForSale,
            price: details.resalePrice.toString()
          });
        }
      }
      
      setTickets(ticketsList);
      
      if (account) {
        const ownedTicketId = await contract.getTicketOf(account);
        if (ownedTicketId.toString() !== '0') {
          setOwnedTicket(ownedTicketId.toString());
        } else {
          setOwnedTicket(null);
        }
      }
    } catch (error) {
      console.error("Error loading available tickets:", error);
      setError("Failed to load available tickets");
    }
    setLoading(false);
  }

  async function loadResaleTickets() {
    if (!contract) return;
    try {
      const [ticketIds, prices] = await contract.checkResale();
      const formattedResaleTickets = [];
      
      for (let i = 0; i < ticketIds.length; i++) {
        if (ticketIds[i].toString() !== '0') {
          formattedResaleTickets.push({
            ticketId: ticketIds[i].toString(),
            price: prices[i].toString()
          });
        }
      }
      
      setResaleTickets(formattedResaleTickets);
    } catch (error) {
      console.error("Error loading resale tickets:", error);
    }
  }

  async function loadOwnedTicket() {
    if (!contract || !account) return;
    try {
      const ticketId = await contract.getTicketOf(account);
      if (ticketId.toString() !== '0') {
        setOwnedTicket(ticketId.toString());
      }
    } catch (error) {
      console.error("Error loading owned ticket:", error);
    }
  }

  async function buyTicket(ticketId) {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    try {
      // Get the ticket price
      const price = await contract.ticketPrice();
      console.log('Ticket price:', ethers.utils.formatEther(price), 'ETH');
      
      // Check user's balance
      const balance = await provider.getBalance(account);
      if (balance.lt(price)) {
        setError("Insufficient balance to buy ticket");
        setLoading(false);
        return;
      }

      // Send transaction with manual gas limit
      const tx = await contract.buyTicket(ticketId, {
        value: price,
        gasLimit: 300000
      });

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 1) {
        // Transaction successful
        await loadAvailableTickets();
        await loadOwnedTicket();
        alert("Ticket purchased successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error buying ticket:", error);
      
      if (error.message.includes("Ticket already sold")) {
        setError("This ticket has already been sold");
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setError("Insufficient funds to cover gas fees");
      } else {
        setError("Failed to buy ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function offerSwap() {
    if (!contract || !desiredTicketForSwap) {
      setError("Please enter the ticket number you want to swap with");
      return;
    }

    if (!ownedTicket) {
      setError("You must own a ticket to offer a swap");
      return;
    }
    
    setLoading(true);
    try {
      // Convert to number and validate
      const targetTicketId = parseInt(desiredTicketForSwap);
      if (isNaN(targetTicketId) || targetTicketId <= 0 || targetTicketId > 100) {
        setError("Invalid ticket number");
        return;
      }

      // First check if the target ticket exists and is owned
      const details = await contract.getTicketDetails(targetTicketId);
      
      if (details.owner === ethers.constants.AddressZero) {
        setError("This ticket is not owned by anyone");
        return;
      }

      if (details.owner.toLowerCase() === account.toLowerCase()) {
        setError("Cannot swap with your own ticket");
        return;
      }

      if (details.isForSale) {
        setError("Cannot swap with a ticket that is listed for resale");
        return;
      }

      const tx = await contract.offerSwap(targetTicketId, {
        gasLimit: 300000
      });
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      if (receipt.status === 1) {
        setDesiredTicketForSwap('');
        alert("Swap offer submitted successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error offering swap:", error);
      if (error.message.includes("You don't own a ticket")) {
        setError("You must own a ticket to offer a swap");
      } else if (error.message.includes("Target ticket not owned")) {
        setError("The ticket you want to swap with is not owned by anyone");
      } else if (error.message.includes("Cannot swap with your own ticket")) {
        setError("You cannot swap with your own ticket");
      } else if (error.message.includes("Target ticket is listed for resale")) {
        setError("Cannot swap with a ticket that is listed for resale");
      } else {
        setError(error.message || "Failed to offer swap");
      }
    } finally {
      setLoading(false);
    }
  }

  async function acceptSwap(ticketId) {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.acceptSwap(ticketId);
      await tx.wait();
      await loadTickets();
      await loadOwnedTicket();
    } catch (error) {
      console.error("Error accepting swap:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  }

  async function listForResale() {
    if (!contract || !selectedTicketForResale || !resalePrice) {
      setError("Please enter both ticket number and price");
      return;
    }
    
    setLoading(true);
    try {
      // Convert ticket ID to number
      const ticketId = parseInt(selectedTicketForResale);
      if (isNaN(ticketId) || ticketId <= 0 || ticketId > 100) {
        setError("Invalid ticket number");
        return;
      }

      // Convert price to Wei
      const priceInWei = ethers.utils.parseEther(resalePrice.toString());
      
      // Call the contract function
      const tx = await contract.resaleTicket(priceInWei);
      console.log("Transaction sent:", tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      if (receipt.status === 1) {
        await loadResaleTickets();
        setResalePrice('');
        setSelectedTicketForResale('');
        alert("Ticket listed for resale successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error listing for resale:", error);
      if (error.message.includes("caller is not the owner")) {
        setError("You don't own this ticket");
      } else if (error.message.includes("invalid price")) {
        setError("Invalid price amount");
      } else {
        setError(error.message || "Failed to list ticket for resale");
      }
    } finally {
      setLoading(false);
    }
  }

  async function acceptResale(ticketId, price) {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    try {
      const tx = await contract.acceptResale(ticketId, {
        value: price.toString(),
        gasLimit: 300000
      });
      
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      if (receipt.status === 1) {
        await loadAvailableTickets();
        await loadResaleTickets();
        await loadOwnedTicket();
        alert("Resale ticket purchased successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error accepting resale:", error);
      if (error.message.includes("insufficient funds")) {
        setError("Insufficient funds to buy this ticket");
      } else if (error.message.includes("not for resale")) {
        setError("This ticket is not available for resale");
      } else {
        setError(error.message || "Failed to buy resale ticket");
      }
    } finally {
      setLoading(false);
    }
  }

  async function checkIfManager() {
    if (!contract || !account) return;
    
    try {
      const managerAddress = await contract.manager();
      setIsManager(managerAddress.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error("Error checking manager status:", error);
      setError("Failed to check manager status. Please try reconnecting your wallet.");
    }
  }

  async function loadTicketPrice() {
    if (!contract) return;
    try {
      const price = await contract.ticketPrice();
      setTicketPrice(price.toString());
    } catch (error) {
      console.error("Error loading ticket price:", error);
    }
  }

  async function updateTicketPrice() {
    if (!contract || !newTicketPrice) return;
    setLoading(true);
    try {
      const priceInWei = ethers.utils.parseEther(newTicketPrice);
      const tx = await contract.updateTicketPrice(priceInWei);
      await tx.wait();
      await loadTicketPrice();
      setNewTicketPrice('');
      alert("Ticket price updated successfully!");
    } catch (error) {
      console.error("Error updating ticket price:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  }

  async function checkTicketOwnership() {
    if (!contract || !searchAddress) return;
    try {
      const ticketId = await contract.getTicketOf(searchAddress);
      if (ticketId.toString() !== '0') {
        setSearchedTicket({
          id: ticketId.toString(),
          owner: searchAddress
        });
      } else {
        setSearchedTicket(null);
        alert('Address does not own a ticket');
      }
    } catch (error) {
      console.error("Error checking ticket:", error);
      alert("Error: " + error.message);
    }
  }

  async function addNewTickets() {
    if (!contract || !newTicketsAmount) return;
    setLoading(true);
    try {
      const amount = parseInt(newTicketsAmount);
      const tx = await contract.addTickets(amount, {
        gasLimit: 500000
      });
      await tx.wait();
      await loadAvailableTickets();
      setNewTicketsAmount('');
      alert(`${amount} new tickets added successfully!`);
    } catch (error) {
      console.error("Error adding tickets:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  }

  async function validateTicket(ticketId) {
    if (!contract) return;
    try {
      const owner = await contract.ticketOwners(ticketId);
      const isForSale = await contract.ticketsForResale(ticketId) > 0;
      const day = getTicketDay(ticketId);
      
      setTicketDetails({
        id: ticketId,
        owner,
        isForSale,
        day,
        isValid: owner !== ethers.constants.AddressZero
      });
      
      setValidationMessage(
        owner !== ethers.constants.AddressZero 
          ? 'Ticket is valid!' 
          : 'Ticket is not valid or does not exist'
      );
    } catch (error) {
      console.error("Error validating ticket:", error);
      setValidationMessage('Error validating ticket');
    }
  }

  function getTicketDay(ticketId) {
    const id = parseInt(ticketId);
    if (id <= 10000) return 'Monday';
    if (id <= 20000) return 'Tuesday';
    if (id <= 30000) return 'Wednesday';
    if (id <= 40000) return 'Thursday';
    if (id <= 50000) return 'Friday';
    return 'Weekend';
  }

  const filteredTickets = tickets.filter(ticket => {
    if (ticket.owner !== ethers.constants.AddressZero) return false;
    
    if (selectedDay === 'All') return true;
    const id = parseInt(ticket.id);
    return id >= ticketDays[selectedDay].start && id <= ticketDays[selectedDay].end;
  });

  const renderManagerSection = () => {
    if (!isManager) return null;

    return (
      <div className={styles.managerSection}>
        <h2>Manager Controls</h2>
        <div className={styles.managerControls}>
          <div className={styles.controlGroup}>
            <h3>Ticket Price Management</h3>
            <div className={styles.priceControl}>
              <input
                type="text"
                placeholder="New Ticket Price (ETH)"
                value={newTicketPrice}
                onChange={(e) => setNewTicketPrice(e.target.value)}
                disabled={loading}
                className={styles.priceInput}
              />
              <button 
                onClick={updateTicketPrice}
                disabled={loading || !newTicketPrice}
                className={styles.updateButton}
              >
                {loading ? 'Updating...' : 'Update Price'}
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <h3>Add New Tickets</h3>
            <div className={styles.ticketControl}>
              <input
                type="number"
                placeholder="Number of tickets"
                value={newTicketsAmount}
                onChange={(e) => setNewTicketsAmount(e.target.value)}
              />
              <button 
                className={styles.addButton}
                onClick={addNewTickets}
                disabled={loading || !newTicketsAmount}
              >
                Add Tickets
              </button>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h4>Total Tickets</h4>
              <p>{tickets.length}</p>
            </div>
            <div className={styles.statCard}>
              <h4>Tickets Sold</h4>
              <p>{tickets.filter(t => t.owner !== ethers.constants.AddressZero).length}</p>
            </div>
            <div className={styles.statCard}>
              <h4>Tickets Available</h4>
              <p>{tickets.filter(t => t.owner === ethers.constants.AddressZero).length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayFilter = () => (
    <div className={styles.dayFilter}>
      <select 
        value={selectedDay} 
        onChange={(e) => setSelectedDay(e.target.value)}
        className={styles.daySelect}
      >
        <option value="All">All Days</option>
        {Object.keys(ticketDays).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Adding the component for festival theme
  const FestivalLights = () => {
    useEffect(() => {
      const createLights = () => {
        const lights = document.createElement('div');
        lights.className = styles.festivalLights;
        
        for(let i = 0; i < 50; i++) {
          const light = document.createElement('div');
          light.className = styles.light;
          light.style.left = `${Math.random() * 100}%`;
          light.style.top = `${Math.random() * 100}%`;
          light.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
          lights.appendChild(light);
        }
        
        document.body.appendChild(lights);
        return () => document.body.removeChild(lights);
      };
      
      return createLights();
    }, []);
    
    return null;
  };

  // Add this to your existing error handling
  const handleContractError = (error) => {
    if (error.code === 'CALL_EXCEPTION') {
      setError('Unable to connect to the contract. Please make sure you are connected to the correct network.');
    } else {
      setError(error.message);
    }
  };

  // Add this component for error display
  const ErrorMessage = ({ message, onDismiss }) => {
    if (!message) return null;
    
    return (
      <div className={styles.errorOverlay}>
        <div className={styles.errorContent}>
          <p>{message}</p>
          <button onClick={onDismiss}>Dismiss</button>
        </div>
      </div>
    );
  };

  async function handleDirectTicketPurchase(e) {
    e.preventDefault();
    if (!ticketNumberInput) {
      setError("Please enter a ticket number");
      return;
    }
    
    const ticketId = parseInt(ticketNumberInput);
    if (isNaN(ticketId) || ticketId <= 0 || ticketId > 100) {
      setError("Please enter a valid ticket number between 1 and 100");
      return;
    }

    await buyTicket(ticketId);
    setTicketNumberInput(''); // Clear input after purchase attempt
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.containerDark : ''}`}>
      <ErrorMessage 
        message={error} 
        onDismiss={() => setError('')} 
      />
      
      <FestivalLights />
      <main className={styles.main}>
        <h1 className={styles.title}>Tihar Festival Ticket Platform</h1>
        
        <div className={styles.accountSection}>
          {account ? (
            <div className={styles.accountCard}>
              <div className={styles.accountInfo}>
                <div className={styles.accountAddress}>
                  <span className={styles.accountIcon}>👤</span>
                  <span>{account.substring(0, 6)}...{account.substring(38)}</span>
                </div>
                {ownedTicket && (
                  <div className={styles.ownedTicketCard}>
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketIcon}>🎫</span>
                      <span>Your Ticket</span>
                    </div>
                    <div className={styles.ticketDetails}>
                      <div className={styles.ticketId}>#{ownedTicket}</div>
                      <div className={styles.ticketDay}>
                        <span className={styles.dayIcon}>📅</span>
                        {parseInt(ownedTicket) <= 10000 ? 'Monday' :
                         parseInt(ownedTicket) <= 20000 ? 'Tuesday' :
                         parseInt(ownedTicket) <= 30000 ? 'Wednesday' :
                         parseInt(ownedTicket) <= 40000 ? 'Thursday' :
                         parseInt(ownedTicket) <= 50000 ? 'Friday' : 'Weekend'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className={styles.disconnectButton} onClick={() => {}}>
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              className={styles.connectButton} 
              onClick={async () => {
                try {
                  await initWeb3();
                } catch (error) {
                  // Error is already handled in initWeb3
                  console.log('Connection cancelled or failed');
                }
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div className={styles.card}>
          <h2>Ticket Ownership Lookup</h2>
          <div className={styles.lookupSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Enter Ethereum Address (0x...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className={styles.searchInput}
              />
              <button 
                onClick={checkTicketOwnership}
                className={styles.searchButton}
                disabled={!searchAddress}
              >
                Search
              </button>
            </div>
            
            {searchedTicket && (
              <div className={styles.ticketDetails}>
                <h3>Ticket Found!</h3>
                <div className={styles.ticketInfo}>
                  <p><strong>Ticket ID:</strong> #{searchedTicket.id}</p>
                  <p><strong>Owner:</strong> {searchedTicket.owner}</p>
                  <p><strong>Day:</strong> {
                    parseInt(searchedTicket.id) <= 10000 ? 'Monday' :
                    parseInt(searchedTicket.id) <= 20000 ? 'Tuesday' :
                    parseInt(searchedTicket.id) <= 30000 ? 'Wednesday' :
                    parseInt(searchedTicket.id) <= 40000 ? 'Thursday' :
                    parseInt(searchedTicket.id) <= 50000 ? 'Friday' : 'Weekend'
                  }</p>
                </div>
              </div>
            )}
            
            {searchAddress && !searchedTicket && !loading && (
              <div className={styles.noTicket}>
                <p>This address does not own any tickets</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Ticket Validation</h2>
          <div className={styles.validationSection}>
            <div className={styles.searchBox}>
              <input
                type="number"
                placeholder="Enter Ticket ID"
                onChange={(e) => validateTicket(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            {ticketDetails && (
              <div className={`${styles.validationResult} ${ticketDetails.isValid ? styles.valid : styles.invalid}`}>
                <h3>Ticket Details</h3>
                <p><strong>Status:</strong> {validationMessage}</p>
                <p><strong>Day:</strong> {ticketDetails.day}</p>
                <p><strong>Owner:</strong> {ticketDetails.owner}</p>
                <p><strong>For Sale:</strong> {ticketDetails.isForSale ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Logs */}
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <div className={styles.eventLogs}>
            {eventLogs.map((log, index) => (
              <div key={index} className={styles.eventLog}>
                <p className={styles.eventType}>{log.event}</p>
                <div className={styles.eventDetails}>
                  {log.event === 'Ticket Purchased' && (
                    <>
                      <p>Ticket #{log.ticketId}</p>
                      <p>Buyer: {log.buyer.substring(0, 6)}...{log.buyer.substring(38)}</p>
                    </>
                  )}
                  {log.event === 'Ticket Swapped' && (
                    <>
                      <p>Ticket #{log.ticket1Id} ⇄ #{log.ticket2Id}</p>
                    </>
                  )}
                  {log.event === 'Ticket Resold' && (
                    <>
                      <p>Ticket #{log.ticketId}</p>
                      <p>Price: {log.price} ETH</p>
                      <p>From: {log.from.substring(0, 6)}...{log.from.substring(38)}</p>
                      <p>To: {log.to.substring(0, 6)}...{log.to.substring(38)}</p>
                    </>
                  )}
                  <p className={styles.timestamp}>{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {renderManagerSection()}
        {renderDayFilter()}

        <div className={styles.grid}>
          {/* Ticket Management Section */}
          {account && (
            <div className={styles.card}>
              <h2>Manage Your Tickets</h2>
              <div className={styles.managementSection}>
                {/* Resale Section */}
                <div className={styles.managementControl}>
                  <h3>List for Resale</h3>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      placeholder="Ticket Number"
                      value={selectedTicketForResale}
                      onChange={(e) => setSelectedTicketForResale(e.target.value)}
                      className={styles.managementInput}
                    />
                    <input
                      type="text"
                      placeholder="Price in ETH"
                      value={resalePrice}
                      onChange={(e) => setResalePrice(e.target.value)}
                      className={styles.managementInput}
                    />
                  </div>
                  <button 
                    onClick={listForResale}
                    className={styles.actionButton}
                    disabled={!selectedTicketForResale || !resalePrice || loading}
                  >
                    {loading ? 'Processing...' : <><span>🏷️</span> List Ticket</>}
                  </button>
                </div>

                {/* Swap Section */}
                <div className={styles.managementControl}>
                  <h3>Offer Swap</h3>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      placeholder="Desired Ticket Number"
                      value={desiredTicketForSwap}
                      onChange={(e) => setDesiredTicketForSwap(e.target.value)}
                      className={styles.managementInput}
                    />
                  </div>
                  <button 
                    onClick={offerSwap}
                    className={styles.actionButton}
                    disabled={!desiredTicketForSwap || loading}
                  >
                    {loading ? 'Processing...' : <><span>🔄</span> Offer Swap</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Available Tickets with fixed price display */}
          <div className={styles.card}>
            <h2>Available Tickets</h2>
            
            {/* Add this direct purchase section */}
            <div className={styles.directPurchaseSection}>
              <form onSubmit={handleDirectTicketPurchase} className={styles.directPurchaseForm}>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={ticketNumberInput}
                    onChange={(e) => setTicketNumberInput(e.target.value)}
                    placeholder="Enter ticket number (1-100)"
                    className={styles.ticketInput}
                  />
                  <button 
                    type="submit"
                    className={styles.directBuyButton}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Buy Ticket'}
                  </button>
                </div>
                <p className={styles.ticketInputHelper}>
                  Enter the specific ticket number you want to purchase
                </p>
              </form>
            </div>

            {loading ? (
              <div className={styles.loader}>Loading...</div>
            ) : (
              <div className={styles.ticketList}>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <div key={ticket.id} className={styles.ticketCard}>
                      <div className={styles.ticketInfo}>
                        <h3>Ticket #{ticket.id}</h3>
                        <p className={styles.ticketDay}>
                          {getTicketDay(ticket.id)}
                        </p>
                        <p className={styles.ticketPrice}>
                          Price: {ethers.utils.formatEther(ticketPrice)} ETH
                        </p>
                      </div>
                      <button 
                        className={styles.buyButton}
                        onClick={() => buyTicket(ticket.id)}
                        disabled={loading}
                        title={loading ? 'Processing...' : ''}
                      >
                        {loading ? 'Processing...' : 'Buy Ticket'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.noTickets}>
                    <p>No available tickets for {selectedDay === 'All' ? 'any day' : selectedDay}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resale Tickets */}
          <div className={styles.card}>
            <h2>Resale Tickets</h2>
            <div className={styles.ticketList}>
              {resaleTickets.length > 0 ? (
                resaleTickets.map((ticket) => (
                  <div key={ticket.ticketId} className={styles.ticketCard}>
                    <div className={styles.ticketInfo}>
                      <h3>Ticket #{ticket.ticketId}</h3>
                      <p className={styles.ticketDay}>
                        {getTicketDay(ticket.ticketId)}
                      </p>
                      <p className={styles.ticketPrice}>
                        Price: {ethers.utils.formatEther(ticket.price)} ETH
                      </p>
                    </div>
                    <button 
                      onClick={() => acceptResale(ticket.ticketId, ticket.price)}
                      className={styles.buyButton}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Buy Resale Ticket'}
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.noTickets}>
                  <p>No tickets available for resale</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <button 
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
} 
