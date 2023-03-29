// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoERC721Factory} from "src/MementoERC721Factory.sol";

contract MementoERC721FactoryDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoERC721Factory factory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    factory = new MementoERC721Factory();
    console2.log("MementoERC721Factory Deployed:", address(factory));
    vm.stopBroadcast();
  }
}
