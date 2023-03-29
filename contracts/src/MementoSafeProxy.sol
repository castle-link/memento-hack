// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {GnosisSafeProxy} from "safe-contracts/proxies/GnosisSafeProxy.sol";

contract MementoSafeProxy is GnosisSafeProxy {
  constructor(
    address singleton,
    bytes memory initializerData
  ) GnosisSafeProxy(singleton) {
    (bool success, bytes memory ret) = singleton.delegatecall(initializerData);
    require(success, string(ret));
  }
}