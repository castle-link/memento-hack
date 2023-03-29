// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoERC721WithMaxSupplyFactory} from "src/MementoERC721WithMaxSupplyFactory.sol";

contract MementoERC721WithMaxSupplyFactoryDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoERC721WithMaxSupplyFactory factory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    factory = new MementoERC721WithMaxSupplyFactory();
    console2.log("MementoERC721WithMaxSupplyFactory Deployed:", address(factory));
    vm.stopBroadcast();
  }
}
