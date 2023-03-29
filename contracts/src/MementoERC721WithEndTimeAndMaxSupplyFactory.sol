// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.13;

import {MementoERC721WithEndTimeAndMaxSupply} from "./MementoERC721WithEndTimeAndMaxSupply.sol";

contract MementoERC721WithEndTimeAndMaxSupplyFactory {
  event CollectionCreated(address indexed createdBy, address indexed collectionAddress);
  function createERC721WithEndTimeAndMaxSupply(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 startTime,
    address admin,
    uint256 endTime,
    uint256 maxSupply
  ) public returns (MementoERC721WithEndTimeAndMaxSupply collection) {
    collection = new MementoERC721WithEndTimeAndMaxSupply(
      name,
      symbol,
      baseURI,
      startTime,
      admin,
      endTime,
      maxSupply
    );
    emit CollectionCreated(admin, address(collection));
  }
}

