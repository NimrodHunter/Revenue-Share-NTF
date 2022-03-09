import { task } from "hardhat/config";

import { FeesOracle } from "../../src/types/FeesOracle";
import { FeesOracle__factory } from "../../src/types/factories/FeesOracle__factory";

import { StakedShareFactory } from "../../src/types/StakedShareFactory";
import { StakedShareFactory__factory } from "../../src/types/factories/StakedShareFactory__factory";

task("deploy:StakedShareFactory")
  .setAction(async function (_, { ethers }) {

    const shareFee = ethers.utils.parseEther("0.0000000001");
    const revenueFee = ethers.utils.parseEther("0.000000000000001");

    const feesOracleFactory: FeesOracle__factory = <FeesOracle__factory>await ethers.getContractFactory("FeesOracle");
    const feesOracle: FeesOracle = <FeesOracle>await feesOracleFactory.deploy(shareFee, revenueFee);
    await feesOracle.deployed();
    console.log("FeesOracle deployed to: ", feesOracle.address);

    const ownerAddress = "0xBAEea0217BeE969D05b0d80002753d6926e4db4f";

    const stakedShareFFactory: StakedShareFactory__factory = <StakedShareFactory__factory>await ethers.getContractFactory("StakedShareFactory");
    const stakedShareFactory: StakedShareFactory = <StakedShareFactory>await stakedShareFFactory.deploy(ownerAddress, feesOracle.address);
    await stakedShareFactory.deployed();
    console.log("Staked Share Factory deployed to: ", stakedShareFactory.address);
});
