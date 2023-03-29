// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.13;

import {MementoERC721WithMaxSupply} from "./MementoERC721WithMaxSupply.sol";

contract MementoERC721WithMaxSupplyFactory {
  event CollectionCreated(address indexed createdBy, address indexed collectionAddress);

  function createCollectionWithMaxSupply(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 startTime,
    address admin,
    uint256 maxSupply
  ) public returns (MementoERC721WithMaxSupply collection) {
    collection = new MementoERC721WithMaxSupply(
      name,
      symbol,
      baseURI,
      startTime,
      admin,
      maxSupply
    );
    emit CollectionCreated(admin, address(collection));
  }

}

