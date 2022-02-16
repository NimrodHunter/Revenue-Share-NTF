import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockToken } from "../../src/types/MockToken";
import type { StakedShare } from "../../src/types/StakedShare";
import { Signers } from "../types";
import { shouldBehaveLikeStakedShare } from "./StakedShare.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.maxUint256 = ethers.constants.MaxUint256;
  });

  describe("Staked Share", function () {
    beforeEach(async function () {
      let initialSupply = this.maxUint256;
      this.tokenName = "Revenue Token";
      this.tokenSymbol = "RT";

      const mockTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
      this.mockToken = <MockToken>await waffle.deployContract(this.signers.admin, mockTokenArtifact, [initialSupply]);

      const stakedShareArtifact: Artifact = await artifacts.readArtifact("StakedShare");
      this.stakedShare = <StakedShare>await waffle.deployContract(this.signers.admin, stakedShareArtifact, [
        this.mockToken.address
      ]);

    });

    shouldBehaveLikeStakedShare();
  });
});