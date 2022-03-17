import { expect } from "chai";
import { increaseTime } from "../utils/time";
import type { Artifact } from "hardhat/types";
import { artifacts, ethers, waffle } from "hardhat";
import type { MockToken } from "../../src/types/MockToken";

export function shouldBehaveLikeRevenueFactory(): void {
    it("Successful Deployment", async function () { 
        const owner = this.signers.admin;

        const numberOfClaimables = await this.revenueFactory.connect(owner).claimables();
        expect(numberOfClaimables).to.equal(0);
    });

    it("create a revenue claim for a project", async function () {
        const owner = this.signers.admin;
        const fee = ethers.utils.parseEther("0.1");
        const revenue = 100000000000;

        const implementation = this.revenueClaim.address;
        const initialSupply = this.maxUint256;

        const rewardTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
        this.rewardToken = <MockToken>await waffle.deployContract(this.signers.admin, rewardTokenArtifact, [
            initialSupply,
            "Coinbase USD",
            "USDC"
        ]);

        const approveTx = await this.rewardToken.connect(owner).approve(this.revenueFactory.address, this.maxUint256);
        await approveTx.wait();

        const cloneTx  = await this.revenueFactory.connect(owner).revenueShare(
            implementation,
            this.stakedShare.address,
            this.rewardToken.address,
            revenue,
            this.revClaim.root,
            this.revClaim.block,
            {value: fee}
        );
        const clonedTx = await cloneTx.wait();

        const claimables = await this.revenueFactory.connect(owner).claimables();
        expect(claimables).to.equal(1);

        const event = clonedTx.events?.filter((x: { event: string; }) => {
            return (x.event == "Cloned")
        })[0].args

        expect(event.rewardToken).to.equal(this.rewardToken.address);

        const revenueClaimContract = this.revenueClaim.attach(event.clone);
            
        const cNft = await revenueClaimContract.connect(owner).nft();
        expect(cNft).to.equal(this.stakedShare.address)

        const cRewardToken = await revenueClaimContract.connect(owner).rewardToken();
        expect(cRewardToken).to.equal(this.rewardToken.address);

        const cRevenue = await revenueClaimContract.connect(owner).revenue();
        expect(cRevenue).to.equal(revenue);

        const cRoot = await revenueClaimContract.connect(owner).root();
        expect(cRoot).to.equal(this.revClaim.root);

        const cBlock = await revenueClaimContract.connect(owner).blockNumber();
        expect(cBlock).to.equal(this.revClaim.block);
        
    });

}