// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract TestMulti {

    uint256 public number;

    function func1()external view returns (uint, uint){
    
        return (1, block.timestamp);
    }

    function func2()external view returns (uint, uint){
 
        return (2, block.timestamp);
    }

    function getData1() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func1.selector);
    }
    
    function getData2() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func2.selector);
    }

}