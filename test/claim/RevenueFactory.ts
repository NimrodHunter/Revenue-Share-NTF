import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockToken } from "../../src/types/MockToken";
import type { FeesOracle } from "../../src/types/FeesOracle";
import type { StakedShareFactory } from "../../src/types/StakedShareFactory";
import type { StakedShare } from "../../src/types/StakedShare";
import type { RevenueFactory } from "../../src/types/RevenueFactory";
import type { RevenueClaim } from "../../src/types/RevenueClaim";

import { Signers } from "../types";
import { projectNFTs, addReward, createMerkleTree } from "../utils/merkle";
import { shouldBehaveLikeRevenueFactory } from "./RevenueFactory.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.vault = signers[9];
    this.maxUint256 = ethers.constants.MaxUint256;
  });

  describe("Revenue Factory", function () {
    beforeEach(async function () {
      const owner = this.signers.admin;
      const initialSupply = this.maxUint256;
      //console.log(initialSupply.toString());
      const shareFee = ethers.utils.parseEther("10");
      const revenueFee = ethers.utils.parseEther("0.1");

      const feesOracleArtifact: Artifact = await artifacts.readArtifact("FeesOracle");
      this.feesOracle = <FeesOracle>await waffle.deployContract(this.signers.admin, feesOracleArtifact, [
        shareFee,
        revenueFee
      ]);

      // Staked Share
      const stakedShareFactoryArtifact: Artifact = await artifacts.readArtifact("StakedShareFactory");
      this.stakedShareFactory = <StakedShareFactory>await waffle.deployContract(this.signers.admin, stakedShareFactoryArtifact, [
        this.vault.address,
        this.feesOracle.address
      ]);

      const stakedShareArtifact: Artifact = await artifacts.readArtifact("StakedShare");
      this.stakedShare = <StakedShare>await waffle.deployContract(this.signers.admin, stakedShareArtifact, []);

      let name = "Aave Token";
      let symbol = "AAVE";

      const projectTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
      this.projectToken = <MockToken>await waffle.deployContract(this.signers.admin, projectTokenArtifact, [
        initialSupply,
        name,
        symbol
      ]);
        
      const implementation = this.stakedShare.address;
      const projectToken = this.projectToken.address;
      name = "Aave Revenue";
      symbol = "RAAVE";
      const logo = "aave.svg";

      const cloneTx  = await this.stakedShareFactory.connect(this.signers.admin).stakedShare(implementation, projectToken, name, symbol, logo, {value: shareFee});
      const clonedTx = await cloneTx.wait();

      const event = clonedTx.events?.filter((x: { event: string; }) => {
          return (x.event == "Cloned")
      })[0].args

      this.stakedShare = this.stakedShare.attach(event.clone);

      // Create 3 NFTs

      // 1
      let stakedAmount = 1000;
      let lockedTime = 4; // 120 sec

      // approve token trasnfer
      let approveTx = await this.projectToken.connect(owner).approve(this.stakedShare.address, this.maxUint256);
      await approveTx.wait();

      //loked stake
      let stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
      await stakeTx.wait();

      // 2
      stakedAmount = 700;
      lockedTime = 6; // 180 sec

      //loked stake
      stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
      await stakeTx.wait();

      // 3
      stakedAmount = 300;
      lockedTime = 2; // 60 sec

      //loked stake
      stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
      await stakeTx.wait();

      // get nfts
      const blockNfts = await projectNFTs(owner, this.stakedShare);
      const nfts = addReward(blockNfts.nfts);
      const root = createMerkleTree(nfts);
      this.revClaim = { root, block: blockNfts.block, nfts }
      
      // Revenue Claim
      const revenueFactoryArtifact: Artifact = await artifacts.readArtifact("RevenueFactory");
      this.revenueFactory = <RevenueFactory>await waffle.deployContract(this.signers.admin, revenueFactoryArtifact, [
        this.vault.address,
        this.feesOracle.address
      ]);

      const revenueClaimArtifact: Artifact = await artifacts.readArtifact("RevenueClaim");
      this.revenueClaim = <RevenueClaim>await waffle.deployContract(this.signers.admin, revenueClaimArtifact, []);

    });

    shouldBehaveLikeRevenueFactory();
  });
});