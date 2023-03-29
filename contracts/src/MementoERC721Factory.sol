// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.13;

import {MementoERC721} from "./MementoERC721.sol";

contract MementoERC721Factory {
  event CollectionCreated(address indexed createdBy, address indexed collectionAddress);
  
  function createERC721Collection(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 startTime,
    address admin
  ) public returns (MementoERC721 collection) {
    collection = new MementoERC721(name, symbol, baseURI, startTime, admin);
    emit CollectionCreated(admin, address(collection));
  }

}

