// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {MementoMulticall} from "src/Multicall/MementoMulticall.sol";

contract MementoMulticallDeployer is Script {
  function setUp() public {}

  function run() public returns (MementoMulticall multicall) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    multicall = new MementoMulticall(
      0x37909e961860E10de295F6a02AD1b834D00424Ce,
      0xcA11bde05977b3631167028862bE2a173976CA11 // Base testnet multicall3 deployment
    );
    console2.log("MementoMulticall Deployed:", address(multicall));
    vm.stopBroadcast();
  }
}
