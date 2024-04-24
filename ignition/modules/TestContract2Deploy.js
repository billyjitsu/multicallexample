const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {

  //const testingContract = m.contract("TestMulti");
  // const multiCallRead = m.contract("MultiCallRead");
   const secondTestContract= m.contract("SecondTestMulti");

  return { secondTestContract };
});
