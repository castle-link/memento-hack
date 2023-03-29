// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console2} from 'forge-std/console2.sol';
import {Create2SafeFactory} from "src/Create2SafeFactory.sol";
import {GnosisSafeProxyFactory} from "safe-contracts/proxies/GnosisSafeProxyFactory.sol";

contract Create2SafeFactoryDeployer is Script {
  function setUp() public {}

  function run() public returns (Create2SafeFactory factory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    factory = new Create2SafeFactory(
      // GnosisSafeProxyFactory(0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2),
      // 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552
      GnosisSafeProxyFactory(0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC),
      0x69f4D1788e39c87893C980c06EdF4b7f686e2938
    );
    console2.log("Create2SafeFactory Deployed:", address(factory));
    vm.stopBroadcast();
  }
}
