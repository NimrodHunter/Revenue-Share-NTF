import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { MockToken } from "../../src/types/MockToken";
import { MockToken__factory } from "../../src/types/factories/MockToken__factory";

import { StakedShare } from "../../src/types/StakedShare";
import { StakedShare__factory } from "../../src/types/factories/StakedShare__factory";

task("deploy:MockToken")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const mockTokenFactory: MockToken__factory = <MockToken__factory>await ethers.getContractFactory("MockToken");
    const mockToken: MockToken = <MockToken>await mockTokenFactory.deploy(taskArguments.initialSupply_);
    await mockToken.deployed();
    console.log("Mock Token deployed to: ", mockToken.address);
});

task("deploy:StakedShare")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const stakedShareFactory: StakedShare__factory = <StakedShare__factory>await ethers.getContractFactory("StakedShare");
    const stakedShare: StakedShare = <StakedShare>await stakedShareFactory.deploy(taskArguments.projectToken_);
    await stakedShare.deployed();
    console.log("Staked Share deployed to: ", stakedShare.address);
});
