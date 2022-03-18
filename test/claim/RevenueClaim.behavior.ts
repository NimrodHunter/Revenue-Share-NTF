import { expect } from "chai";
import { ethers} from "hardhat";
import { proof, NFT } from "../utils/merkle";

interface Claim {
    root: string;
    block: number;
    nfts: NFT[];
  }

export function shouldBehaveLikeRevenueClaim(): void {
    it("Successful Deployment", async function () { 
        const revenue = 100000000000;

        const owner = this.signers.admin;

        const cNft = await this.revenueClaim.connect(owner).nft();
        expect(cNft).to.equal(this.stakedShare.address)

        const cRewardToken = await this.revenueClaim.connect(owner).rewardToken();
        expect(cRewardToken).to.equal(this.rewardToken.address);

        const cRevenue = await this.revenueClaim.connect(owner).revenue();
        expect(cRevenue).to.equal(revenue);

        const cRoot = await this.revenueClaim.connect(owner).root();
        expect(cRoot).to.equal(this.revClaim.root);

        const cBlock = await this.revenueClaim.connect(owner).blockNumber();
        expect(cBlock).to.equal(this.revClaim.block);
    });

    it("claim reward", async function () {
        const owner = this.signers.admin;
        const revenue = 100000000000;
        const granularity = 1000000;
        const nftID = 2;
        const claimData: Claim = {
            root:<string>this.revClaim.root,
            block:<number>this.revClaim.block,
            nfts:<NFT[]>this.revClaim.nfts
        }
        const nft = claimData.nfts.find(nft => nft.id.toString().localeCompare(nftID.toString()) === 0 )
        const proofData = proof(claimData.nfts, nftID);

        const expectedReward = ethers.BigNumber.from(nft?.reward).mul(revenue).div(granularity);

        const claimingTx = await this.revenueClaim.connect(owner).claim(nftID, nft?.reward, proofData.proof)
        const claimedTx = await claimingTx.wait();

        const event = claimedTx.events?.filter((x: { event: string; }) => {
            return (x.event == "Claimed")
        })[0].args

        expect(event.amount).to.equal(expectedReward);
        expect(event.NFTId).to.equal(nftID);
        
        const isClaimed = await this.revenueClaim.connect(owner).claimed(nftID)
        expect(isClaimed).to.be.true;
    });

}