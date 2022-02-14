import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockToken } from "../../src/types/MockToken";
import { Signers } from "../types";
import { shouldBehaveLikeMockToken } from "./MockToken.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Mock Token", function () {
    beforeEach(async function () {
      let initialSupply = 1000;
      let beneficiary = this.signers.admin.getAddress();

      const mockTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
      this.mockToken = <MockToken>await waffle.deployContract(this.signers.admin, mockTokenArtifact, [initialSupply]);

    });

    shouldBehaveLikeMockToken();
  });
});