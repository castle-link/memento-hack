// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {MementoERC721Factory} from "../src/MementoERC721Factory.sol";
import {MementoERC721WithEndTimeAndMaxSupply} from "../src/MementoERC721WithEndTimeAndMaxSupply.sol";

contract MementoERC721WithEndTimeAndMaxSupplyTest is Test {
  MementoERC721WithEndTimeAndMaxSupply token;

  address public owner;

  function setUp() public {
    token = new MementoERC721WithEndTimeAndMaxSupply(
      "Memento",
      "MNT",
      "https://memento.live/api/metadata/",
      block.timestamp,
      address(this),
      block.timestamp + 2000,
      3
    );
  }

  function testMint() public {
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    assertEq(MementoERC721WithEndTimeAndMaxSupply(token).totalSupply(), 1);
  }

  function testFailMintMoreThanMaxSupply() public {
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
  }

  function testFailMintAfterEndTime() public {
    skip(2000);
    MementoERC721WithEndTimeAndMaxSupply(token).mint(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
  }

  function testChangeMaxSupply() public {
    MementoERC721WithEndTimeAndMaxSupply(token).changeMaxSupply(4);
    assertEq(MementoERC721WithEndTimeAndMaxSupply(token).maxSupply(), 4);
  }

  function testFailChangeMaxSupplyWithoutAdmin() public {
    vm.prank(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    MementoERC721WithEndTimeAndMaxSupply(token).changeMaxSupply(2);
  }

  function testChangeEndTime() public {
    MementoERC721WithEndTimeAndMaxSupply(token).changeEndTime(block.timestamp + 3000);
    assertEq(MementoERC721WithEndTimeAndMaxSupply(token).endTime(), block.timestamp + 3000);
  }

  function testFailChangeEndTimeWithoutAdmin() public {
    vm.prank(0x1092361f4eAfDC6e4555Ee761E87Ef9c67b9e42f);
    MementoERC721WithEndTimeAndMaxSupply(token).changeEndTime(block.timestamp + 3000);
  }

}
