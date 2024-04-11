// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract MultiCallRead {

    function multiCall(address[] calldata targets, bytes[] calldata callDatas) external view returns (bytes[] memory) {
        bytes[] memory results = new bytes[](targets.length);
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].staticcall(callDatas[i]);
            require(success, "MultiCallRead: call failed");
            results[i] = result;
        }
        return results;
    }
}