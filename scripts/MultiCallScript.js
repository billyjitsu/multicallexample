const { ethers } = require("ethers");
require("dotenv").config();
const multicABI = require("./abis/Multicall3.json");

// Setup provider and signer
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
console.log("Wallet address: ", wallet.address);

// Contract setups
const multiCall3Address = "0x9835F00a3f5C539eBfE19DD01715749558CDe25A";
const yourContractAddress = "0xbB5b06470EFE90492930AC469b5471D3E8370A3E";
const multicallContract = new ethers.Contract(multiCall3Address, multicABI.abi, wallet);
// Manual way of inputting the ABI - You may see this style in some examples
const testContractABI = [
    "function func1() external view returns (uint, uint)",
    "function func2() external view returns (uint, uint)",
    "function func3() external",
    "function func4() external",
    "function timestampf3() external view returns (uint256)",
    "function timestampf4() external view returns (uint256)"
]
const yourContract = new ethers.Contract(yourContractAddress, testContractABI, provider);

async function batchCallUsingAggregate3() {
  // Dynamically encode the calls to your functions
  const callActions = ["func1", "func2"]; // Function names to be called
  const callsData = await Promise.all(callActions.map(async (funcName) => {
    return yourContract.interface.encodeFunctionData(funcName, []);
  }));

  // Construct the calls array in the desired format
  const calls = callsData.map((callData) => [
    yourContractAddress,
    true,
    callData,
  ]);
  console.log("Formatted batch calls for aggregate3:", JSON.stringify(calls));

  const tempCall = [["0xbB5b06470EFE90492930AC469b5471D3E8370A3E",false,"0x74135154"],["0xbB5b06470EFE90492930AC469b5471D3E8370A3E",false,"0xb1ade4db"],["0xbB5b06470EFE90492930AC469b5471D3E8370A3E",false,"0x74135154"]];

  // Execute batch call
  try {
    const returnData = await multicallContract.aggregate3(calls);
    // const returnData = await multicallContract.aggregate3(tempCall);
    console.log("Return Data:", returnData);

  } catch (error) {
    console.error("Error executing aggregate3 call:", error);
  }
}

batchCallUsingAggregate3().catch(console.error);
