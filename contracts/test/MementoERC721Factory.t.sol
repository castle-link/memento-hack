// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {MementoERC721Factory} from "../src/MementoERC721Factory.sol";
import {MementoERC721} from "../src/MementoERC721.sol";

contract MementoERC721FactoryTest is Test {
    MementoERC721Factory tf;

    address public owner;

    function setUp() public {
        tf = new MementoERC721Factory();
    }

    // function test_launchTokenWithEndTimeAndMaxSupply() public {
    //     MementoERC721 token = tf.createERC721WithEndTimeAndMaxSupply('A', 'B', 'C', 0, owner, 0, 100);
    //     assertEq(token.name(), 'A');
    // }

    // function test_launchTokenWithEndTime() public {
    //     MementoERC721 token = tf.createCollectionWithEndTime('A', 'B', 'C', 0, owner, 100);
    //     assertEq(token.name(), 'A');
    // }

    // function test_launchTokenWithMaxSupply() public {
    //     MementoERC721 token = tf.createCollectionWithMaxSupply('A', 'B', 'C', 0, owner, 0);
    //     assertEq(token.name(), 'A');
    // }

    function test_launchToken() public {
        MementoERC721 token = tf.createERC721Collection('A', 'B', 'C', 0, owner);
        assertEq(token.name(), 'A');
    }
}
