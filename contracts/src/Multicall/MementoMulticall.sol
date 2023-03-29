// SPDX-License-Identifier: MIT 

pragma solidity ^0.8;

import {Multicall3} from 'multicall/Multicall3.sol';

contract MementoMulticall is Multicall3 {
  address public admin;
  mapping(address => bool) public authorized;
  address public multicall3Address;
  Multicall3 public multicall3;

  constructor(address _admin, address _multicall3Address) {
    admin = _admin;
    authorized[_admin] = true;
    multicall3 = Multicall3(_multicall3Address);
  }

  function setAuthorized(address authorizedAddress, bool _authorized) external onlyOwner {
    authorized[authorizedAddress] = _authorized;
  }


  function useAggregate3(Call3[] calldata calls) public payable onlyOwner returns (Result[] memory returnData) {
    returnData = multicall3.aggregate3(calls);
  }

  function useAggregate3Value(Call3Value[] calldata calls) public payable onlyOwner returns (Result[] memory returnData) {
    returnData = multicall3.aggregate3Value(calls);
  }

  modifier onlyOwner() {
    require(msg.sender == admin, 'MementoMulticall: not owner');
    _;
  }

}