import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { StakedShareFactory } from "../../src/types/StakedShareFactory";
import type { FeesOracle } from "../../src/types/FeesOracle";
import type { StakedShare } from "../../src/types/StakedShare";
import { Signers } from "../types";
import { shouldBehaveLikeStakedShareFactory } from "./StakedShareFactory.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.vault = signers[9];
    this.maxUint256 = ethers.constants.MaxUint256;
  });

  describe("Staked Share Factory", function () {
    beforeEach(async function () {
      const initialSupply = this.maxUint256;
      //console.log(initialSupply.toString());
      const shareFee = ethers.utils.parseEther("10");
      const revenueFee = ethers.utils.parseEther("0.1");

      const feesOracleArtifact: Artifact = await artifacts.readArtifact("FeesOracle");
      this.feesOracle = <FeesOracle>await waffle.deployContract(this.signers.admin, feesOracleArtifact, [
        shareFee,
        revenueFee
      ]);

      const stakedShareFactoryArtifact: Artifact = await artifacts.readArtifact("StakedShareFactory");
      this.stakedShareFactory = <StakedShareFactory>await waffle.deployContract(this.signers.admin, stakedShareFactoryArtifact, [
        this.vault.address,
        this.feesOracle.address
      ]);

      const stakedShareArtifact: Artifact = await artifacts.readArtifact("StakedShare");
      this.stakedShare = <StakedShare>await waffle.deployContract(this.signers.admin, stakedShareArtifact, []);

    });

    shouldBehaveLikeStakedShareFactory();
  });
});