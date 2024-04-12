// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TextStorage {
    string private storedText;

    function saveText(string memory newText) public {
        storedText = newText;
    }

    function getText() public view returns (string memory) {
        return storedText;
    }
}