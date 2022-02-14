import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { MockToken } from "../../src/types/MockToken";
import { MockToken__factory } from "../../src/types/factories/MockToken__factory";

task("deploy:MockToken")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const mockTokenFactory: MockToken__factory = <MockToken__factory>await ethers.getContractFactory("VestedToken");
    const mockToken: MockToken = <MockToken>await mockTokenFactory.deploy(taskArguments.initialSupply_);
    await mockToken.deployed();
    console.log("Mock Token deployed to: ", mockToken.address);
  });
