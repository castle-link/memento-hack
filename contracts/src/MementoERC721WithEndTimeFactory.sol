// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.13;

import {MementoERC721WithEndTime} from "./MementoERC721WithEndTime.sol";

contract MementoERC721WithEndTimeFactory {
  event CollectionCreated(address indexed createdBy, address indexed collectionAddress);
  
  function createCollectionWithEndTime(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 startTime,
    address admin,
    uint256 endTime
  ) public returns (MementoERC721WithEndTime collection) {
    collection = new MementoERC721WithEndTime(
      name,
      symbol,
      baseURI,
      startTime,
      admin,
      endTime
    );
    emit CollectionCreated(admin, address(collection));
  }

}

