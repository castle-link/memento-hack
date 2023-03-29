// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoMultisend} from "src/Multisend/MementoMultisend.sol";

contract MementoMultisendDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoMultisend multicall) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    multicall = new MementoMultisend(
      0x37909e961860E10de295F6a02AD1b834D00424Ce
    );
    console2.log("MementoMultisend Deployed:", address(multicall));
    vm.stopBroadcast();
  }
}
