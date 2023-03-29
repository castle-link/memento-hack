// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {MementoERC721} from "./MementoERC721.sol";

contract MementoERC721WithMaxSupply is MementoERC721 {
  uint256 public maxSupply;

  constructor(
    string memory name,
    string memory symbol,
    string memory _baseURI,
    uint256 _startTime,
    address _admin,
    uint256 _maxSupply
  ) MementoERC721(name, symbol, _baseURI, _startTime, _admin) {
    maxSupply = _maxSupply;
  }

  function mint(address _to) external override checkStartTime checkSupply {
    unchecked {
      _mint(_to, totalSupply++);
    }
  }

  // May want to change the max supply
  function changeMaxSupply(uint256 _newMaxSupply) public onlyAdmin {
    require (_newMaxSupply > maxSupply, "New max supply must be greater");
    maxSupply = _newMaxSupply;
  }

  modifier checkSupply {
    require(totalSupply < maxSupply, "No more supply");
    _;
  }

}