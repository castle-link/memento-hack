// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {ERC721} from "solmate/tokens/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

error DoesNotExist();

/**
 * @title   MementoERC721
 * @custom:version 1.1
 * @author  mehranhydary (mhrn.eth)
 * @notice  MementoERC721 is a simple ERC721 token.
 */

contract MementoERC721 is ERC721, Ownable {
  address public admin;
  string public baseURI;
  uint256 startTime;
  uint256 public totalSupply; // No limit

  /**
   * @notice Set the name, symbol, and metadata for the NFT.
   *         The admin of the ERC721 token is the user who 
   *         deploys the contract.
   * @param name                The name of the ERC721 token.
   * @param symbol              The symbol of the ERC721 token.
   * @param _baseURI            The metadata of the ERC721 will be stored at this
   *                            link.
   */
  constructor(
    string memory name,
    string memory symbol,
    string memory _baseURI,
    uint256 _startTime,
    address _admin
  ) ERC721(name, symbol) {
    startTime = _startTime;
    baseURI = _baseURI;
    admin = _admin;
  }

  /**
   * @dev Function that is used to mint the ERC721 token. 
   * @param _to Address of the recipient of the ERC721 token.
   */
  function mint(address _to) external virtual checkStartTime { // U N L I M I T E D  M I N T
    unchecked {
      _mint(_to, totalSupply++);
    }
  }
  /**
   * @dev Function that is used to get the metadata URI
   * @param id Id of the token that 
   */
  function tokenURI(uint256 id) public view override returns (string memory) {
    if (ownerOf(id) == address(0)) revert DoesNotExist();
    return string(abi.encodePacked(baseURI, id));
  }
  /**
   * @dev Function used to update the admin of this contract.
   *      Can only be called by the admin.
   * @param _newAdmin This is the address that will replace the current admin.
   */
  function updateAdmin(address _newAdmin) public onlyAdmin {
    admin = _newAdmin;
  }


  /**
   * @dev Function used to update the metadata for this ERC721 token. Can only
   *      be called by the admin.
   * @param _updatedBaseURI This is the new URI that contains the metadata.
   */
  function updateBaseURI(string memory _updatedBaseURI) public onlyAdmin {
    baseURI = _updatedBaseURI;
  }

  function changeStartTime(uint256 _newStartTime) public onlyAdmin {
    startTime = _newStartTime;
  }

  /**
   * @dev Modifer to ensure only admin can call the function
   */
  modifier onlyAdmin {
    require(msg.sender == admin);
    _;
  }
  modifier checkStartTime {
    require(block.timestamp >= startTime);
    _;
  }
}