// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {MementoERC721} from "./MementoERC721.sol";

contract MementoERC721WithEndTime is MementoERC721 {
  uint public endTime;
  
  constructor(
    string memory name,
    string memory symbol,
    string memory _baseURI,
    uint _startTime,
    address _admin,
    uint _endTime
  ) MementoERC721(name, symbol, _baseURI, _startTime, _admin) {
    endTime = _endTime;
  }

  function mint(address _to) external override checkStartTime checkEndTime {
    unchecked {
      _mint(_to, totalSupply++);
    }
  }

  // May want to change the end time
  function changeEndTime(uint _newEndTime) public onlyAdmin {
    require (_newEndTime > endTime, "New end time must be greater");
    endTime = _newEndTime;
  }

  modifier checkEndTime {
    require(block.timestamp < endTime, "End time is greater than current time");
    _;
  }
}