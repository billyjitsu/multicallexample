const { ethers } = require("ethers");
require("dotenv").config();
const multicABI = require("./abis/Multicall3.json");
const multiCallReadABI = require("./abis/MultiCallRead.json");

// Setup provider and signer
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
console.log("Wallet address: ", wallet.address);

// Contract setups
const multiCallREADONLYAddress = "0xb9D07d90b98182cd4DE542AB8FA1B4447c15A0f5";
const multiCall3Address = "0x9835F00a3f5C539eBfE19DD01715749558CDe25A";
const yourContractAddress = "0xc6143B395b0595063ae435bDBD6DfC74Bd598D28";

const multiCallReadContract = new ethers.Contract(multiCallREADONLYAddress, multiCallReadABI.abi, wallet);
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
const yourContract = new ethers.Contract(yourContractAddress, testContractABI, wallet);

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

  // Execute batch call
  try {
    // const returnData = await multicallContract.aggregate3(calls);
    const returnData = await multiCallReadContract.multiCall(calls);
    console.log("Return Data:", returnData);

  } catch (error) {
    console.error("Error executing aggregate3 call:", error);
  }

  console.log("Check Timestamps with a regular tx Function call to Function 3 and 4");

      let tx1 = await yourContract.func3();
       await tx1.wait();
      let tx2 = await yourContract.func4();
      await tx2.wait();
      console.log(
        "Timestamp with a regular tx Function 3:",
        await yourContract.timestampf3()
      );
      console.log(
        "Timestamp with a regular tx Function 4:",
        await yourContract.timestampf4())

  const callTxActions = ["func3", "func4"]; // Function names to be called
  const callsTxData = await Promise.all(callTxActions.map(async (funcName) => {
    return yourContract.interface.encodeFunctionData(funcName, []);
  }));

  // Construct the calls array in the desired format
  const callsTx = callsTxData.map((callData) => [
    yourContractAddress,
    true,
    callData,
  ]);
  console.log("Formatted batch callsTx for aggregate3:", JSON.stringify(callsTx));

  // Execute batch call
  try {
    const returnData = await multicallContract.aggregate3(callsTx);
    returnData.wait();
    // console.log("Return Data:", returnData);

  } catch (error) {
    console.error("Error executing aggregate3 call:", error);
  }

  console.log(
    "Timestamp after multiCall Function 3:",
    await yourContract.timestampf3()
  );
  console.log(
    "Timestamp after multiCall Function 4:",
    await yourContract.timestampf4())

}

batchCallUsingAggregate3().catch(console.error);
