// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoERC721WithEndTimeAndMaxSupplyFactory} from "src/MementoERC721WithEndTimeAndMaxSupplyFactory.sol";

contract MementoERC721WithEndTimeAndMaxSupplyFactoryDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoERC721WithEndTimeAndMaxSupplyFactory factory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    factory = new MementoERC721WithEndTimeAndMaxSupplyFactory();
    console2.log("MementoERC721WithEndTimeAndMaxSupplyFactory Deployed:", address(factory));
    vm.stopBroadcast();
  }
}
