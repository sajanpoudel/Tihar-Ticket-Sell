"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./artifacts/contracts/TicketSale.sol/TicketSale.json":
/*!************************************************************!*\
  !*** ./artifacts/contracts/TicketSale.sol/TicketSale.json ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = /*#__PURE__*/JSON.parse('{"_format":"hh-sol-artifact-1","contractName":"TicketSale","sourceName":"contracts/TicketSale.sol","abi":[{"inputs":[{"internalType":"uint256","name":"numTickets","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"TicketResaleListed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"TicketResold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":false,"internalType":"address","name":"offerer","type":"address"}],"name":"TicketSwapOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ticket1Id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ticket2Id","type":"uint256"}],"name":"TicketSwapped","type":"event"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"acceptResale","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"acceptSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"additionalTickets","type":"uint256"}],"name":"addTickets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"buyTicket","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"checkResale","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAvailableTickets","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"getTicketDetails","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"bool","name":"isForSale","type":"bool"},{"internalType":"uint256","name":"resalePrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"person","type":"address"}],"name":"getTicketOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"offerSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"resaleTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"swapOffers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ticketOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ticketsForResale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ticketsOwned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"updateTicketPrice","outputs":[],"stateMutability":"nonpayable","type":"function"}],"bytecode":"0x608060405234801561001057600080fd5b506040516111e93803806111e983398101604081905261002f916100fc565b6000821161008f5760405162461bcd60e51b815260206004820152602260248201527f4e756d626572206f66207469636b657473206d75737420626520706f73697469604482015261766560f01b60648201526084015b60405180910390fd5b600081116100df5760405162461bcd60e51b815260206004820152601660248201527f5072696365206d75737420626520706f736974697665000000000000000000006044820152606401610086565b600080546001600160a01b03191633179055600155600255610120565b6000806040838503121561010f57600080fd5b505080516020909101519092909150565b6110ba8061012f6000396000f3fe6080604052600436106101095760003560e01c806367dd74ca11610095578063a3c1a1fe11610064578063a3c1a1fe14610324578063c4a4be8314610344578063dd11247e14610359578063eb2dbcf61461036f578063f02137c8146103a557600080fd5b806367dd74ca1461029b578063943ba212146102ae578063951e2021146102c1578063a13f1c62146102ee57600080fd5b8063406b2c2c116100dc578063406b2c2c146101d4578063407724ac146101f4578063481c6a75146102215780635a8acacc146102595780635ff3337f1461027b57600080fd5b80630412f4ab1461010e5780631209b1f6146101575780631bf330041461016d57806324c141601461018f575b600080fd5b34801561011a57600080fd5b50610144610129366004610f07565b6001600160a01b031660009081526004602052604090205490565b6040519081526020015b60405180910390f35b34801561016357600080fd5b5061014460015481565b34801561017957600080fd5b5061018d610188366004610f37565b6103c5565b005b34801561019b57600080fd5b506101af6101aa366004610f37565b610512565b604080516001600160a01b03909416845291151560208401529082015260600161014e565b3480156101e057600080fd5b5061018d6101ef366004610f37565b610599565b34801561020057600080fd5b5061014461020f366004610f37565b60056020526000908152604090205481565b34801561022d57600080fd5b50600054610241906001600160a01b031681565b6040516001600160a01b03909116815260200161014e565b34801561026557600080fd5b5061026e61068b565b60405161014e9190610f50565b34801561028757600080fd5b5061018d610296366004610f37565b610790565b61018d6102a9366004610f37565b61089c565b61018d6102bc366004610f37565b610a5b565b3480156102cd57600080fd5b506101446102dc366004610f07565b60046020526000908152604090205481565b3480156102fa57600080fd5b50610241610309366004610f37565b6006602052600090815260409020546001600160a01b031681565b34801561033057600080fd5b5061018d61033f366004610f37565b610cb2565b34801561035057600080fd5b5061026e610d73565b34801561036557600080fd5b5061014460025481565b34801561037b57600080fd5b5061024161038a366004610f37565b6003602052600090815260409020546001600160a01b031681565b3480156103b157600080fd5b5061018d6103c0366004610f37565b610e5f565b33600090815260046020526040812054908190036103fe5760405162461bcd60e51b81526004016103f590610f94565b60405180910390fd5b6000828152600360209081526040808320548484526006909252909120546001600160a01b0390811691161461046c5760405162461bcd60e51b81526020600482015260136024820152722737903b30b634b21039bbb0b81037b33332b960691b60448201526064016103f5565b6000828152600360209081526040808320805485855282852080546001600160a01b039092166001600160a01b031992831681179091558254339083168117909355918552600484528285208790558185528285208690558585526006845293829020805490941690935580518481529182018590527f3c5c3ca34136e6c4e2255ca1f42341f16cf924acaee035adeb287bda89025af6910160405180910390a1505050565b6000806000808411801561052857506002548411155b6105685760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081d1a58dad95d081251607a1b60448201526064016103f5565b5050506000908152600360209081526040808320546005909252909120546001600160a01b03909116918115159190565b33600090815260046020526040812054908190036105c95760405162461bcd60e51b81526004016103f590610f94565b6000828152600360205260409020546001600160a01b031661062d5760405162461bcd60e51b815260206004820152601760248201527f546172676574207469636b6574206e6f74206f776e656400000000000000000060448201526064016103f5565b60008281526006602090815260409182902080546001600160a01b031916339081179091558251858152918201527f0c429c57e135043f6747763fe5b3b53a88a48f2f03c709eaeb8634d2bf3d3f7c91015b60405180910390a15050565b6060600060015b60025481116106d7576000818152600360205260409020546001600160a01b03166106c557816106c181610fda565b9250505b806106cf81610fda565b915050610692565b5060008167ffffffffffffffff8111156106f3576106f3610ff3565b60405190808252806020026020018201604052801561071c578160200160208202803683370190505b509050600060015b6002548111610787576000818152600360205260409020546001600160a01b0316610775578083838151811061075c5761075c611009565b60209081029190910101528161077181610fda565b9250505b8061077f81610fda565b915050610724565b50909392505050565b6000546001600160a01b031633146107ea5760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c79206d616e616765722063616e20616464207469636b6574730000000060448201526064016103f5565b6000811161083a5760405162461bcd60e51b815260206004820152601c60248201527f4d75737420616464206174206c65617374206f6e65207469636b65740000000060448201526064016103f5565b60008160025461084a919061101f565b90506000600254600161085d919061101f565b90505b81811161089557600081815260036020526040902080546001600160a01b03191690558061088d81610fda565b915050610860565b5060025550565b6000811180156108ae57506002548111155b6108ee5760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081d1a58dad95d081251607a1b60448201526064016103f5565b6000818152600360205260409020546001600160a01b0316156109495760405162461bcd60e51b8152602060048201526013602482015272151a58dad95d08185b1c9958591e481cdbdb19606a1b60448201526064016103f5565b336000908152600460205260409020541561099e5760405162461bcd60e51b8152602060048201526015602482015274105b1c9958591e481bdddb9cc818481d1a58dad95d605a1b60448201526064016103f5565b60015434146109ef5760405162461bcd60e51b815260206004820152601860248201527f496e636f7272656374207061796d656e7420616d6f756e74000000000000000060448201526064016103f5565b600081815260036020908152604080832080546001600160a01b0319163390811790915580845260048352928190208490558051848152918201929092527f785f2865353ae960010300f584fc6c577b757a853af69a99c769df3c8232d3de910160405180910390a150565b600081815260056020526040902054610aae5760405162461bcd60e51b81526020600482015260156024820152745469636b6574206e6f7420666f7220726573616c6560581b60448201526064016103f5565b6000818152600560205260409020543414610aff5760405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c185e5b595b9d607a1b60448201526064016103f5565b3360009081526004602052604090205415610b545760405162461bcd60e51b8152602060048201526015602482015274105b1c9958591e481bdddb9cc818481d1a58dad95d605a1b60448201526064016103f5565b60008181526003602090815260408083205460059092528220546001600160a01b03909116916064610b8783600a611038565b610b91919061104f565b90506000610b9f8284611071565b6040519091506001600160a01b0385169082156108fc029083906000818181858888f19350505050158015610bd8573d6000803e3d6000fd5b50600080546040516001600160a01b039091169184156108fc02918591818181858888f19350505050158015610c12573d6000803e3d6000fd5b50600085815260036020908152604080832080546001600160a01b03191633908117909155808452600483528184208990556001600160a01b0388168085528285208590558985526005845282852094909455815189815292830193909352810191909152606081018490527fd59a36d8310ffb140214be490baf3fe8961f859a17199ec1bf9015c8b73400119060800160405180910390a15050505050565b3360009081526004602052604081205490819003610ce25760405162461bcd60e51b81526004016103f590610f94565b60008211610d2b5760405162461bcd60e51b81526020600482015260166024820152755072696365206d75737420626520706f73697469766560501b60448201526064016103f5565b60008181526005602090815260409182902084905581518381529081018490527fa365c2e4770e249b3dbb47dbf991ec623ced2f1ded6b65442da12cade5514e07910161067f565b6060600060015b6002548111610db75760008181526005602052604090205415610da55781610da181610fda565b9250505b80610daf81610fda565b915050610d7a565b5060008167ffffffffffffffff811115610dd357610dd3610ff3565b604051908082528060200260200182016040528015610dfc578160200160208202803683370190505b509050600060015b60025481116107875760008181526005602052604090205415610e4d5780838381518110610e3457610e34611009565b602090810291909101015281610e4981610fda565b9250505b80610e5781610fda565b915050610e04565b6000546001600160a01b03163314610eb95760405162461bcd60e51b815260206004820152601d60248201527f4f6e6c79206d616e616765722063616e2075706461746520707269636500000060448201526064016103f5565b60008111610f025760405162461bcd60e51b81526020600482015260166024820152755072696365206d75737420626520706f73697469766560501b60448201526064016103f5565b600155565b600060208284031215610f1957600080fd5b81356001600160a01b0381168114610f3057600080fd5b9392505050565b600060208284031215610f4957600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b81811015610f8857835183529284019291840191600101610f6c565b50909695505050505050565b602080825260169082015275165bdd48191bdb89dd081bdddb8818481d1a58dad95d60521b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600060018201610fec57610fec610fc4565b5060010190565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b8082018082111561103257611032610fc4565b92915050565b808202811582820484141761103257611032610fc4565b60008261106c57634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561103257611032610fc456fea2646970667358221220a769b3e9bfcae8ca3349525212be63bfd792dbda3db51bee8a32c362ba75d89864736f6c63430008130033","deployedBytecode":"0x6080604052600436106101095760003560e01c806367dd74ca11610095578063a3c1a1fe11610064578063a3c1a1fe14610324578063c4a4be8314610344578063dd11247e14610359578063eb2dbcf61461036f578063f02137c8146103a557600080fd5b806367dd74ca1461029b578063943ba212146102ae578063951e2021146102c1578063a13f1c62146102ee57600080fd5b8063406b2c2c116100dc578063406b2c2c146101d4578063407724ac146101f4578063481c6a75146102215780635a8acacc146102595780635ff3337f1461027b57600080fd5b80630412f4ab1461010e5780631209b1f6146101575780631bf330041461016d57806324c141601461018f575b600080fd5b34801561011a57600080fd5b50610144610129366004610f07565b6001600160a01b031660009081526004602052604090205490565b6040519081526020015b60405180910390f35b34801561016357600080fd5b5061014460015481565b34801561017957600080fd5b5061018d610188366004610f37565b6103c5565b005b34801561019b57600080fd5b506101af6101aa366004610f37565b610512565b604080516001600160a01b03909416845291151560208401529082015260600161014e565b3480156101e057600080fd5b5061018d6101ef366004610f37565b610599565b34801561020057600080fd5b5061014461020f366004610f37565b60056020526000908152604090205481565b34801561022d57600080fd5b50600054610241906001600160a01b031681565b6040516001600160a01b03909116815260200161014e565b34801561026557600080fd5b5061026e61068b565b60405161014e9190610f50565b34801561028757600080fd5b5061018d610296366004610f37565b610790565b61018d6102a9366004610f37565b61089c565b61018d6102bc366004610f37565b610a5b565b3480156102cd57600080fd5b506101446102dc366004610f07565b60046020526000908152604090205481565b3480156102fa57600080fd5b50610241610309366004610f37565b6006602052600090815260409020546001600160a01b031681565b34801561033057600080fd5b5061018d61033f366004610f37565b610cb2565b34801561035057600080fd5b5061026e610d73565b34801561036557600080fd5b5061014460025481565b34801561037b57600080fd5b5061024161038a366004610f37565b6003602052600090815260409020546001600160a01b031681565b3480156103b157600080fd5b5061018d6103c0366004610f37565b610e5f565b33600090815260046020526040812054908190036103fe5760405162461bcd60e51b81526004016103f590610f94565b60405180910390fd5b6000828152600360209081526040808320548484526006909252909120546001600160a01b0390811691161461046c5760405162461bcd60e51b81526020600482015260136024820152722737903b30b634b21039bbb0b81037b33332b960691b60448201526064016103f5565b6000828152600360209081526040808320805485855282852080546001600160a01b039092166001600160a01b031992831681179091558254339083168117909355918552600484528285208790558185528285208690558585526006845293829020805490941690935580518481529182018590527f3c5c3ca34136e6c4e2255ca1f42341f16cf924acaee035adeb287bda89025af6910160405180910390a1505050565b6000806000808411801561052857506002548411155b6105685760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081d1a58dad95d081251607a1b60448201526064016103f5565b5050506000908152600360209081526040808320546005909252909120546001600160a01b03909116918115159190565b33600090815260046020526040812054908190036105c95760405162461bcd60e51b81526004016103f590610f94565b6000828152600360205260409020546001600160a01b031661062d5760405162461bcd60e51b815260206004820152601760248201527f546172676574207469636b6574206e6f74206f776e656400000000000000000060448201526064016103f5565b60008281526006602090815260409182902080546001600160a01b031916339081179091558251858152918201527f0c429c57e135043f6747763fe5b3b53a88a48f2f03c709eaeb8634d2bf3d3f7c91015b60405180910390a15050565b6060600060015b60025481116106d7576000818152600360205260409020546001600160a01b03166106c557816106c181610fda565b9250505b806106cf81610fda565b915050610692565b5060008167ffffffffffffffff8111156106f3576106f3610ff3565b60405190808252806020026020018201604052801561071c578160200160208202803683370190505b509050600060015b6002548111610787576000818152600360205260409020546001600160a01b0316610775578083838151811061075c5761075c611009565b60209081029190910101528161077181610fda565b9250505b8061077f81610fda565b915050610724565b50909392505050565b6000546001600160a01b031633146107ea5760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c79206d616e616765722063616e20616464207469636b6574730000000060448201526064016103f5565b6000811161083a5760405162461bcd60e51b815260206004820152601c60248201527f4d75737420616464206174206c65617374206f6e65207469636b65740000000060448201526064016103f5565b60008160025461084a919061101f565b90506000600254600161085d919061101f565b90505b81811161089557600081815260036020526040902080546001600160a01b03191690558061088d81610fda565b915050610860565b5060025550565b6000811180156108ae57506002548111155b6108ee5760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081d1a58dad95d081251607a1b60448201526064016103f5565b6000818152600360205260409020546001600160a01b0316156109495760405162461bcd60e51b8152602060048201526013602482015272151a58dad95d08185b1c9958591e481cdbdb19606a1b60448201526064016103f5565b336000908152600460205260409020541561099e5760405162461bcd60e51b8152602060048201526015602482015274105b1c9958591e481bdddb9cc818481d1a58dad95d605a1b60448201526064016103f5565b60015434146109ef5760405162461bcd60e51b815260206004820152601860248201527f496e636f7272656374207061796d656e7420616d6f756e74000000000000000060448201526064016103f5565b600081815260036020908152604080832080546001600160a01b0319163390811790915580845260048352928190208490558051848152918201929092527f785f2865353ae960010300f584fc6c577b757a853af69a99c769df3c8232d3de910160405180910390a150565b600081815260056020526040902054610aae5760405162461bcd60e51b81526020600482015260156024820152745469636b6574206e6f7420666f7220726573616c6560581b60448201526064016103f5565b6000818152600560205260409020543414610aff5760405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c185e5b595b9d607a1b60448201526064016103f5565b3360009081526004602052604090205415610b545760405162461bcd60e51b8152602060048201526015602482015274105b1c9958591e481bdddb9cc818481d1a58dad95d605a1b60448201526064016103f5565b60008181526003602090815260408083205460059092528220546001600160a01b03909116916064610b8783600a611038565b610b91919061104f565b90506000610b9f8284611071565b6040519091506001600160a01b0385169082156108fc029083906000818181858888f19350505050158015610bd8573d6000803e3d6000fd5b50600080546040516001600160a01b039091169184156108fc02918591818181858888f19350505050158015610c12573d6000803e3d6000fd5b50600085815260036020908152604080832080546001600160a01b03191633908117909155808452600483528184208990556001600160a01b0388168085528285208590558985526005845282852094909455815189815292830193909352810191909152606081018490527fd59a36d8310ffb140214be490baf3fe8961f859a17199ec1bf9015c8b73400119060800160405180910390a15050505050565b3360009081526004602052604081205490819003610ce25760405162461bcd60e51b81526004016103f590610f94565b60008211610d2b5760405162461bcd60e51b81526020600482015260166024820152755072696365206d75737420626520706f73697469766560501b60448201526064016103f5565b60008181526005602090815260409182902084905581518381529081018490527fa365c2e4770e249b3dbb47dbf991ec623ced2f1ded6b65442da12cade5514e07910161067f565b6060600060015b6002548111610db75760008181526005602052604090205415610da55781610da181610fda565b9250505b80610daf81610fda565b915050610d7a565b5060008167ffffffffffffffff811115610dd357610dd3610ff3565b604051908082528060200260200182016040528015610dfc578160200160208202803683370190505b509050600060015b60025481116107875760008181526005602052604090205415610e4d5780838381518110610e3457610e34611009565b602090810291909101015281610e4981610fda565b9250505b80610e5781610fda565b915050610e04565b6000546001600160a01b03163314610eb95760405162461bcd60e51b815260206004820152601d60248201527f4f6e6c79206d616e616765722063616e2075706461746520707269636500000060448201526064016103f5565b60008111610f025760405162461bcd60e51b81526020600482015260166024820152755072696365206d75737420626520706f73697469766560501b60448201526064016103f5565b600155565b600060208284031215610f1957600080fd5b81356001600160a01b0381168114610f3057600080fd5b9392505050565b600060208284031215610f4957600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b81811015610f8857835183529284019291840191600101610f6c565b50909695505050505050565b602080825260169082015275165bdd48191bdb89dd081bdddb8818481d1a58dad95d60521b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600060018201610fec57610fec610fc4565b5060010190565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b8082018082111561103257611032610fc4565b92915050565b808202811582820484141761103257611032610fc4565b60008261106c57634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561103257611032610fc456fea2646970667358221220a769b3e9bfcae8ca3349525212be63bfd792dbda3db51bee8a32c362ba75d89864736f6c63430008130033","linkReferences":{},"deployedLinkReferences":{}}');

/***/ })

});