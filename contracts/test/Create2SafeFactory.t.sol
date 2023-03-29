// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {GnosisSafeProxyFactory} from "safe-contracts/proxies/GnosisSafeProxyFactory.sol";
import {Create2SafeFactory} from "../src/Create2SafeFactory.sol";
import {MementoSafeProxy} from "../src/MementoSafeProxy.sol";

interface CheatCodes {
    function addr(uint256) external returns (address);
}

contract Create2SafeFactoryTest is Test {
    Create2SafeFactory wf;

    address public owner;
    address public addr1;

    // address public singleton = 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552;
    address public singleton = 0x69f4D1788e39c87893C980c06EdF4b7f686e2938;

    // address public fallbackHandler = 0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4;
    address public fallbackHandler = 0x017062a1dE2FE6b99BE3d9d37841FeD19F573804;
    

    CheatCodes cheats = CheatCodes(HEVM_ADDRESS);

    address ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
    uint256 ZERO_AMOUNT = 0;
    bytes EMPTY_VALUE = "";

    function setUp() public {
        owner = address(this);
        addr1 = cheats.addr(1);
        wf = new Create2SafeFactory(
            // GnosisSafeProxyFactory(0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2),
            GnosisSafeProxyFactory(0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC),
            singleton
        );
    }

    function test_getDeploymentAddress(string memory a) view public {
        address[] memory _owners = new address[](1);
        _owners[0] = owner;
        address deploymentAddress = wf.getDeploymentAddress(
            _owners,
            1,
            ZERO_ADDRESS,
            EMPTY_VALUE,
            fallbackHandler, // Change to fallback handler
            ZERO_ADDRESS,
            ZERO_AMOUNT,
            payable(ZERO_ADDRESS),
            a
        );
        assert(true);
    }

    function test_deployWallet(string memory a) public {
        address[] memory _owners = new address[](1);
        _owners[0] = owner;
        address deploymentAddress = wf.getDeploymentAddress(
            _owners,
            1,
            ZERO_ADDRESS,
            EMPTY_VALUE,
            fallbackHandler, // Change to fallback handler
            ZERO_ADDRESS,
            ZERO_AMOUNT,
            payable(ZERO_ADDRESS),
            a
        );
        address wallet = wf.createAccount(
            _owners,
            1,
            ZERO_ADDRESS,
            EMPTY_VALUE,
            fallbackHandler, // Change to fallback handler
            ZERO_ADDRESS,
            ZERO_AMOUNT,
            payable(ZERO_ADDRESS),
            a
        );
        assertEq(deploymentAddress, address(wallet));
    }

}
