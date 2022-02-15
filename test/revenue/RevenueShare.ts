import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockToken } from "../../src/types/MockToken";
import type { RevenueShare } from "../../src/types/RevenueShare";
import { Signers } from "../types";
import { shouldBehaveLikeRevenueShare } from "./RevenueShare.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.maxUint256 = ethers.constants.MaxUint256;
  });

  describe("Revenue Share", function () {
    beforeEach(async function () {
      let initialSupply = this.maxUint256;
      let beneficiary = this.signers.admin.getAddress();

      const mockTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
      this.mockToken = <MockToken>await waffle.deployContract(this.signers.admin, mockTokenArtifact, [initialSupply]);

      const revenueShareArtifact: Artifact = await artifacts.readArtifact("RevenueShare");
      this.revenueShare = <RevenueShare>await waffle.deployContract(this.signers.admin, revenueShareArtifact, [
        "Revenue Token",
        "RT",
        this.mockToken.address,
        this.mockToken.address
      ]);

    });

    shouldBehaveLikeRevenueShare();
  });
});