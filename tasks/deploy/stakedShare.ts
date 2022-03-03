import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Faucet } from "../../src/types/Faucet";
import { Faucet__factory } from "../../src/types/factories/Faucet__factory";

import { MockToken } from "../../src/types/MockToken";
import { MockToken__factory } from "../../src/types/factories/MockToken__factory";

import { StakedShare } from "../../src/types/StakedShare";
import { StakedShare__factory } from "../../src/types/factories/StakedShare__factory";

task("deploy:StakedShare")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const initialSupply = ethers.constants.MaxUint256;
    /*
    const faucetFactory: Faucet__factory = <Faucet__factory>await ethers.getContractFactory("Faucet");
    const faucet: Faucet = <Faucet>await faucetFactory.deploy();
    await faucet.deployed();
    console.log("Faucet deployed to: ", faucet.address);
    */
/*
    const mockTokenFactory: MockToken__factory = <MockToken__factory>await ethers.getContractFactory("MockToken");
    const mockToken: MockToken = <MockToken>await mockTokenFactory.deploy(initialSupply);
    await mockToken.deployed();
    console.log("Mock Token deployed to: ", mockToken.address);
     */
    const stakedShareFactory: StakedShare__factory = <StakedShare__factory>await ethers.getContractFactory("StakedShare");
    const stakedShare: StakedShare = <StakedShare>await stakedShareFactory.deploy();
    await stakedShare.deployed();
    console.log("Staked Share deployed to: ", stakedShare.address);
});
