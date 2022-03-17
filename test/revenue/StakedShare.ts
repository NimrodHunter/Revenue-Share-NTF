import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { StakedShareFactory } from "../../src/types/StakedShareFactory";
import type { FeesOracle } from "../../src/types/FeesOracle";
import type { StakedShare } from "../../src/types/StakedShare";
import type { MockToken } from "../../src/types/MockToken";

import { Signers } from "../types";
import { shouldBehaveLikeStakedShare } from "./StakedShare.behavior";

describe("Unit tests", function () {
    before(async function () {
        this.signers = {} as Signers;

        const signers: SignerWithAddress[] = await ethers.getSigners();
        this.signers.admin = signers[0];
        this.vault = signers[9];
        this.maxUint256 = ethers.constants.MaxUint256;
    });

    describe("Staked Share", function () {
        beforeEach(async function () {
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

            const initialSupply = this.maxUint256;
            let name = "Aave Tokens";
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
        });

    shouldBehaveLikeStakedShare();
    });
});