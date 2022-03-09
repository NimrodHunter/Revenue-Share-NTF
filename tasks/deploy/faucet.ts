import { task } from "hardhat/config";

import { Faucet } from "../../src/types/Faucet";
import { Faucet__factory } from "../../src/types/factories/Faucet__factory";

task("deploy:Faucet")
  .setAction(async function (_, { ethers }) {
  
    const faucetFactory: Faucet__factory = <Faucet__factory>await ethers.getContractFactory("Faucet");
    const faucet: Faucet = <Faucet>await faucetFactory.deploy();
    await faucet.deployed();
    console.log("Faucet deployed to: ", faucet.address);
});
