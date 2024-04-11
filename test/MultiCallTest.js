const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Multi", function () {
  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TestContract = await ethers.getContractFactory("TestMulti");
    const testContract = await TestContract.deploy();

    const MultiCall = await ethers.getContractFactory("Multicall3");
    const multiCall = await MultiCall.deploy();

    const MultiCallRead = await ethers.getContractFactory("MultiCallRead");
    const multiCallRead = await MultiCallRead.deploy();

    return { testContract, multiCall, multiCallRead, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Read the functions timestamps", async function () {
      const { testContract } = await loadFixture(
        deployContracts
      );
      // let function1Data = await testContract.func1();
      // console.log("function1Data", function1Data);
      // let function2Data = await testContract.func2();
      // console.log("function2Data", function2Data);


      await testContract.func3();
      await testContract.func4();
      console.log(
        "Timestamp after Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Timestamp after Function 4:",
        await testContract.timestampf4()
      );
    });
  });

  describe("MultiCallTest", function () {
    it("Test with MultiCallRead", async function () {
      const { testContract, multiCall, multiCallRead, owner } = await loadFixture(
        deployContracts
      );

      //const callActions = ["func1", "func2", "func3", "func4"]; // Function names to be called
      const callActions = ["func1", "func2"]; // Function names to be called
      const callsData = await Promise.all(
        callActions.map(async (funcName) => {
          return testContract.interface.encodeFunctionData(funcName, []);
        })
      );

      let contractAddress = await testContract.target;

      // Construct the calls array in the desired format
      const calls = callsData.map((callData) => [
        contractAddress,
        true,
        callData,
      ]);
      console.log(
        "Formatted batch calls for aggregate3:",
        JSON.stringify(calls)
      );

      try {
        const returnData = await multiCallRead.multiCall(calls);
          console.log("Return Data:", returnData);
       } catch (error) {
         console.error("Error executing aggregate3 call:", error);
       }
    });

    it("Test with MultiCall3 Function Call", async function () {
      const { testContract, multiCall, multiCallRead, owner } = await loadFixture(
        deployContracts
      );

      await testContract.func3();
      await testContract.func4();
      console.log("******Timestamp Called with a Normal Tx******")
      console.log(
        "Normal Call of Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Normal Call of Function 4:",
        await testContract.timestampf4()
      );

      const callActions = ["func3", "func4"]; // Function names to be called
      const callsData = await Promise.all(
        callActions.map(async (funcName) => {
          return testContract.interface.encodeFunctionData(funcName, []);
        })
      );

      let contractAddress = await testContract.target;

      // Construct the calls array in the desired format
      const calls = callsData.map((callData) => [
        contractAddress,
        true,
        callData,
      ]);
      // console.log(
      //   "Formatted batch calls for aggregate3:",
      //   JSON.stringify(calls)
      // );

      try {
         const returnData = await multiCall.aggregate3(calls);
         // console.log("Return Data:", returnData);
       } catch (error) {
         console.error("Error executing aggregate3 call:", error);
       }

      console.log("******Timestamp Called with MultiCall3******")
       console.log(
        "Timestamp after Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Timestamp after Function 4:",
        await testContract.timestampf4()
      );

      console.log("Data from MultiCall3:", returnData);

    });
  });
});