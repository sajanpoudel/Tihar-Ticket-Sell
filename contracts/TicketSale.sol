// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TicketSale {
    // Contract variables
    address public manager;
    uint public ticketPrice;
    uint public totalTickets;
    
 

    
    mapping(uint => address) public ticketOwners;
    mapping(address => uint) public ticketsOwned;
    mapping(uint => uint) public ticketsForResale;
    mapping(uint => address) public swapOffers;
    

    // Events for tracking
    event TicketPurchased(uint ticketId, address buyer);
    event TicketSwapOffered(uint ticketId, address offerer);
    event TicketSwapped(uint ticket1Id, uint ticket2Id);
    event TicketResaleListed(uint ticketId, uint price);
    event TicketResold(uint ticketId, address from, address to, uint price);

    constructor(uint numTickets, uint price) {
        require(numTickets > 0, "Number of tickets must be positive");
        require(price > 0, "Price must be positive");
        manager = msg.sender;
        ticketPrice = price;
        totalTickets = numTickets;
        
        // Initialize all tickets as available
        for(uint i = 1; i <= numTickets; i++) {
            ticketOwners[i] = address(0);
        }
    }

    function buyTicket(uint ticketId) public payable {
        require(ticketId > 0 && ticketId <= totalTickets, "Invalid ticket ID");
        require(ticketOwners[ticketId] == address(0), "Ticket already sold");
        require(msg.value == ticketPrice, "Incorrect payment amount");

        ticketOwners[ticketId] = msg.sender;
        ticketsOwned[msg.sender] = ticketId;
        
        // Transfer payment to manager using call
        (bool success, ) = payable(manager).call{value: msg.value}("");
        require(success, "Failed to transfer payment to manager");
        
        emit TicketPurchased(ticketId, msg.sender);
    }

    // Make the contract able to receive ETH
    receive() external payable {}
    fallback() external payable {}

    // Add a function to check manager's balance
    function getManagerBalance() public view returns (uint) {
        return manager.balance;
    }

    function getTicketOf(address person) public view returns (uint) {
        return ticketsOwned[person];
    }

    function offerSwap(uint targetTicketId) public {
        require(targetTicketId > 0 && targetTicketId <= totalTickets, "Invalid ticket ID");
        uint myTicketId = ticketsOwned[msg.sender];
        require(myTicketId != 0, "You don't own a ticket");
        
        address targetOwner = ticketOwners[targetTicketId];
        require(targetOwner != address(0), "Target ticket not owned by anyone");
        require(targetOwner != msg.sender, "Cannot swap with your own ticket");
        
        require(ticketsForResale[targetTicketId] == 0, "Target ticket is listed for resale");
        
        swapOffers[targetTicketId] = msg.sender;
        emit TicketSwapOffered(targetTicketId, msg.sender);
    }

    function acceptSwap(uint ticketId) public {
        uint myTicketId = ticketsOwned[msg.sender];
        require(myTicketId != 0, "You don't own a ticket");
        require(swapOffers[myTicketId] == ticketOwners[ticketId], "No valid swap offer");
        
        address otherOwner = ticketOwners[ticketId];
        
        ticketOwners[myTicketId] = otherOwner;
        ticketOwners[ticketId] = msg.sender;
        
        ticketsOwned[msg.sender] = ticketId;
        ticketsOwned[otherOwner] = myTicketId;
        
        delete swapOffers[myTicketId];
        
        emit TicketSwapped(myTicketId, ticketId);
    }

    function resaleTicket(uint price) public {
        uint ticketId = ticketsOwned[msg.sender];
        require(ticketId != 0, "You don't own a ticket");
        require(price > 0, "Invalid price");
        
        ticketsForResale[ticketId] = price;
        emit TicketResaleListed(ticketId, price);
    }

    function acceptResale(uint ticketId) public payable {
        require(ticketsForResale[ticketId] > 0, "Ticket not for resale");
        require(msg.value == ticketsForResale[ticketId], "Incorrect payment");
        require(ticketsOwned[msg.sender] == 0, "Already owns a ticket");
        
        address previousOwner = ticketOwners[ticketId];
        uint price = ticketsForResale[ticketId];
        uint serviceFee = price * 10 / 100;
        uint sellerAmount = price - serviceFee;
        
        // Transfer service fee to manager
        (bool feeTransfer, ) = payable(manager).call{value: serviceFee}("");
        require(feeTransfer, "Failed to transfer service fee");
        
        // Transfer remaining amount to seller
        (bool sellerTransfer, ) = payable(previousOwner).call{value: sellerAmount}("");
        require(sellerTransfer, "Failed to transfer payment to seller");
        
        ticketOwners[ticketId] = msg.sender;
        ticketsOwned[msg.sender] = ticketId;
        delete ticketsOwned[previousOwner];
        delete ticketsForResale[ticketId];
        
        emit TicketResold(ticketId, previousOwner, msg.sender, price);
    }

    function checkResale() public view returns (uint[] memory) {
        uint count = 0;
        for(uint i = 1; i <= totalTickets; i++) {
            if(ticketsForResale[i] > 0) {
                count++;
            }
        }
        
        uint[] memory resaleTickets = new uint[](count);
        uint currentIndex = 0;
        
        for(uint i = 1; i <= totalTickets; i++) {
            if(ticketsForResale[i] > 0) {
                resaleTickets[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return resaleTickets;
    }

    function getAvailableTickets() public view returns (uint[] memory) {
        uint count = 0;
        for(uint i = 1; i <= totalTickets; i++) {
            if(ticketOwners[i] == address(0)) {
                count++;
            }
        }
        
        uint[] memory availableTickets = new uint[](count);
        uint currentIndex = 0;
        
        for(uint i = 1; i <= totalTickets; i++) {
            if(ticketOwners[i] == address(0)) {
                availableTickets[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return availableTickets;
    }

    function getTicketDetails(uint ticketId) public view returns (
        address owner,
        bool isForSale,
        uint resalePrice
    ) {
        require(ticketId > 0 && ticketId <= totalTickets, "Invalid ticket ID");
        return (
            ticketOwners[ticketId],
            ticketsForResale[ticketId] > 0,
            ticketsForResale[ticketId]
        );
    }

    function updateTicketPrice(uint newPrice) public {
        require(msg.sender == manager, "Only manager can update price");
        require(newPrice > 0, "Price must be positive");
        ticketPrice = newPrice;
    }

    function addTickets(uint additionalTickets) public {
        require(msg.sender == manager, "Only manager can add tickets");
        require(additionalTickets > 0, "Must add at least one ticket");
        
        uint newTotalTickets = totalTickets + additionalTickets;
        
        // Initialize new tickets
        for(uint i = totalTickets + 1; i <= newTotalTickets; i++) {
            ticketOwners[i] = address(0);
        }
        
        totalTickets = newTotalTickets;
    }

    function getTotalAvailableTickets() public view returns (uint) {
        uint count = 0;
        for(uint i = 1; i <= totalTickets; i++) {
            if(ticketOwners[i] == address(0)) {
                count++;
            }
        }
        return count;
    }

    function getTicketPriceInEther() public view returns (uint) {
        return ticketPrice;
    }

    // Add this function to check if an address is the manager
    function isManager(address account) public view returns (bool) {
        return account == manager;
    }
}

