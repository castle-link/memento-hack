// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoERC721WithEndTimeFactory} from "src/MementoERC721WithEndTimeFactory.sol";

contract MementoERC721WithEndTimeFactoryDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoERC721WithEndTimeFactory factory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    factory = new MementoERC721WithEndTimeFactory();
    console2.log("MementoERC721WithEndTimeFactory Deployed:", address(factory));
    vm.stopBroadcast();
  }
}
