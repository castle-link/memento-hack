// SPDX-License-Identifier: MIT 

pragma solidity ^0.8;

contract MementoMultisend {
  struct Transaction {
    address target;
    uint256 value;
    bytes data;
  }
  address public admin;
  mapping(address => bool) public authorized;
  
  constructor(address _admin) {
    admin = _admin;
    authorized[_admin] = true;
  }

  function multisend(Transaction[] memory transactions) public payable onlyAuthorized {
    uint256 totalValue = 0;

    for (uint256 i = 0; i < transactions.length; i++) {
      totalValue += transactions[i].value;
    }

    require(totalValue <= msg.value, 'MementoMultisend: insufficient funds');

    for (uint256 i = 0; i < transactions.length; i++) {
      (bool success, ) = transactions[i].target.call{value: transactions[i].value}(transactions[i].data);
      require(success, 'MementoMultisend: transaction failed');
    }

    if (msg.value > totalValue) {
      (bool success, ) = msg.sender.call{value: msg.value - totalValue}('');
      require(success, 'MementoMultisend: return transaction failed');
    }
  }

  // Admin related features

  function setAuthorized(address authorizedAddress, bool _authorized) external onlyOwner {
    authorized[authorizedAddress] = _authorized;
  }

  modifier onlyOwner() {
    require(msg.sender == admin, 'MementoMulticall: not owner');
    _;
  }

  modifier onlyAuthorized() {
    require(authorized[msg.sender], 'MementoMulticall: not authorized');
    _;
  }

}