import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import TicketSale from '../artifacts/contracts/TicketSale.sol/TicketSale.json';
import styles from '../styles/Home.module.css';
import config from '../config.json';

const contractAddress = "0x4e46d599dc876111c3D5eF24e6053565BF22F70b";

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

      const web3Modal = new Web3Modal({
        network: "sepolia",
        cacheProvider: true,
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Verify contract address
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      // Initialize contract with proper error handling
      try {
        const contract = new ethers.Contract(
          contractAddress,
          TicketSale.abi,
          signer
        );

        // Verify contract is deployed by calling a view function
        await contract.totalTickets();

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

      } catch (error) {
        console.error("Contract initialization error:", error);
        throw new Error('Failed to connect to the contract. Please check if you are on the Sepolia network.');
      }

      // Listen for network changes
      provider.provider.on("chainChanged", () => {
        window.location.reload();
      });

      // Listen for account changes
      provider.provider.on("accountsChanged", () => {
        window.location.reload();
      });

    } catch (error) {
      console.error("Web3 initialization error:", error);
      setError(error.message);
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
      // Check if user is manager
      const isManagerAccount = await contract.isManager(account);
      
      // Only check for existing ticket if not manager
      if (!isManagerAccount) {
        const userTicket = await contract.getTicketOf(account);
        if (userTicket.toString() !== '0') {
          setError("You already own ticket #" + userTicket.toString());
          setLoading(false);
          return;
        }
      }

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
      
      if (error.message.includes("Already owns a ticket")) {
        setError("You already own a ticket");
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setError("Insufficient funds to cover gas fees");
      } else if (error.message.includes("Ticket already sold")) {
        setError("This ticket has already been sold");
      } else {
        setError("Failed to buy ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function offerSwap() {
    if (!contract || !swapTicketId) return;
    setLoading(true);
    try {
      const tx = await contract.offerSwap(swapTicketId);
      await tx.wait();
      alert("Swap offer submitted successfully!");
      setSwapTicketId('');
    } catch (error) {
      console.error("Error offering swap:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
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
    if (!contract || !resalePrice) return;
    setLoading(true);
    try {
      const priceInWei = ethers.utils.parseEther(resalePrice);
      const tx = await contract.resaleTicket(priceInWei);
      await tx.wait();
      await loadResaleTickets();
      setResalePrice('');
      alert("Ticket listed for resale successfully!");
    } catch (error) {
      console.error("Error listing for resale:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  }

  async function acceptResale(ticketId, price) {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.acceptResale(ticketId, { value: price });
      await tx.wait();
      await loadTickets();
      await loadResaleTickets();
      await loadOwnedTicket();
    } catch (error) {
      console.error("Error accepting resale:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
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
            <button className={styles.connectButton} onClick={initWeb3}>
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
          {ownedTicket && (
            <div className={styles.card}>
              <h2>Manage Your Ticket</h2>
              <div className={styles.managementSection}>
                {/* Resale Section */}
                <div className={styles.managementControl}>
                  <h3>List for Resale</h3>
                  <input
                    type="text"
                    placeholder="Price in ETH"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(e.target.value)}
                    className={styles.managementInput}
                  />
                  <button 
                    onClick={listForResale}
                    className={styles.actionButton}
                    disabled={!resalePrice}
                  >
                    <span>🏷️</span> List Ticket
                  </button>
                </div>

                {/* Swap Section */}
                <div className={styles.managementControl}>
                  <h3>Offer Swap</h3>
                  <input
                    type="text"
                    placeholder="Desired Ticket ID"
                    value={swapTicketId}
                    onChange={(e) => setSwapTicketId(e.target.value)}
                    className={styles.managementInput}
                  />
                  <button 
                    onClick={offerSwap}
                    className={styles.actionButton}
                    disabled={!swapTicketId}
                  >
                    <span>🔄</span> Offer Swap
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Available Tickets with fixed price display */}
          <div className={styles.card}>
            <h2>Available Tickets</h2>
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
                        disabled={loading || (!isManager && ownedTicket !== null)}
                        title={!isManager && ownedTicket ? `You already own ticket #${ownedTicket}` : ''}
                      >
                        {loading ? 'Processing...' : 
                         (!isManager && ownedTicket) ? 'Already Own Ticket' : 
                         'Buy Ticket'}
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
                resaleTickets.map((ticket, index) => (
                  <div key={index} className={styles.ticket}>
                    <div>
                      <p>Ticket #{ticket.ticketId}</p>
                      <p>Price: {ethers.utils.formatEther(ticket.price)} ETH</p>
                      <p className={styles.ticketType}>
                        {parseInt(ticket.ticketId) <= 10000 ? 'Monday' :
                         parseInt(ticket.ticketId) <= 20000 ? 'Tuesday' :
                         parseInt(ticket.ticketId) <= 30000 ? 'Wednesday' :
                         parseInt(ticket.ticketId) <= 40000 ? 'Thursday' :
                         parseInt(ticket.ticketId) <= 50000 ? 'Friday' : 'Weekend'}
                      </p>
                    </div>
                    <button onClick={() => acceptResale(ticket.ticketId, ticket.price)}>
                      Buy Resale Ticket
                    </button>
                  </div>
                ))
              ) : (
                <p>No tickets available for resale</p>
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
