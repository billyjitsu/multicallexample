const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {

  //const testingContract = m.contract("TestMulti");
  // const multiCallRead = m.contract("MultiCallRead");
   const multiCall3 = m.contract("Multicall3");

  return { multiCall3};
});
