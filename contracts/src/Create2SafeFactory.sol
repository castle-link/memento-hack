// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.13;

import {GnosisSafeProxyFactory} from "safe-contracts/proxies/GnosisSafeProxyFactory.sol";
import {GnosisSafe} from "safe-contracts/GnosisSafe.sol"; 
import {GnosisSafeProxy} from "safe-contracts/proxies/GnosisSafeProxy.sol"; 
import {Create2} from "openzeppelin-contracts/utils/Create2.sol";
import {MementoSafeProxy} from './MementoSafeProxy.sol';


contract Create2SafeFactory {

  GnosisSafeProxyFactory public immutable proxyFactory;
  address public immutable singleton;

  constructor(GnosisSafeProxyFactory _proxyFactory, address _singleton) {
    proxyFactory = _proxyFactory;
    singleton = _singleton;
  }

  // Will allow deployment without having a user register
  function createAccount(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver,
    string memory salt // Can be email, phone number, social, etc.
  ) public returns (address account) {
    // Figure out how you will use the salt
    bytes memory initializerData = createInitializerData(
      _owners,
      _threshold,
      to,
      data,
      fallbackHandler,
      paymentToken,
      payment,
      paymentReceiver
    );
    
    account = address(deploySafe(singleton, initializerData, salt));
  }

  function createInitializerData(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver
  ) public pure returns (bytes memory initializerData) {
    initializerData = abi.encodeWithSignature(
      "setup(address[],uint256,address,bytes,address,address,uint256,address)",
      _owners,
      _threshold,
      to,
      data,
      fallbackHandler,
      paymentToken,
      payment,
      paymentReceiver
    );
  }

  function deploySafe(address _singleton, bytes memory initializer, string memory salt) internal returns (address wallet) {
    wallet = address(new MementoSafeProxy{salt: stringToBytes32(salt)}(_singleton, initializer));
  }

  function getDeploymentAddress(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver,
    string memory salt
  ) public view returns (address wallet) {
    bytes memory initializerData = createInitializerData(
      _owners,
      _threshold,
      to,
      data,
      fallbackHandler,
      paymentToken,
      payment,
      paymentReceiver
    );
    wallet = address(
      uint160(
        uint256(
          keccak256(
            abi.encodePacked(
              bytes1(0xff),
              address(this),
              stringToBytes32(salt),
              keccak256(
                abi.encodePacked(
                  type(MementoSafeProxy).creationCode,
                  abi.encode(singleton, initializerData)
                )
              )
            )
          )
        )
      )
    );
  }

  function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) return 0x0;

    assembly {
        result := mload(add(source, 32))
    }
  }
}