import { expect } from "chai";
import { increaseTime } from "../utils/utils";
import type { Artifact } from "hardhat/types";
import { artifacts, ethers, waffle } from "hardhat";
import type { MockToken } from "../../src/types/MockToken";

export function shouldBehaveLikeStakedShare(): void {
    it("Successful Deployment", async function () { 
        let owner = this.signers.admin;
        let proyectToken  = await this.stakedShare.connect(owner).projectToken();
        expect(proyectToken.toString()).to.equal(this.projectToken.address);
    });

    it("Successful Stake", async function () { 

        let owner = this.signers.admin;
        let stakedAmount = 1000;
        let lockedTime = 4; // weeks

        // approve token trasnfer
        let approveTx = await this.projectToken.connect(owner).approve(this.stakedShare.address, this.maxUint256);
        await approveTx.wait();
        let allowedAmount = await this.projectToken.connect(owner).allowance(owner.address, this.stakedShare.address);
        expect(allowedAmount).to.equal(this.maxUint256);

        //loked stake
        let stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
        let stakedTX = await stakeTx.wait();
        let eventParams = stakedTX.events?.filter((x) => {
            return (x.event == "Staked")
        })[0].args

        let NFTid = eventParams?.NFTId.toNumber();

        //Revenue Share contarct received project Tokens
        let revContractBalance = await this.projectToken.connect(owner).balanceOf(this.stakedShare.address);
        expect(revContractBalance.toNumber()).to.equal(stakedAmount);

        //verify the ownership of the first NFT
        let NFTOwner = await this.stakedShare.connect(owner).ownerOf(NFTid);
        expect(NFTOwner.toString()).to.equal(owner.address);

        // Verify Owner balances of NFT
        let NFTBalance = await this.stakedShare.connect(owner).balanceOf(owner.address);
        expect(NFTBalance.toNumber()).to.equal(1);

        let NFTTokenUri = await this.stakedShare.connect(owner).tokenURI(NFTid);
        //console.log(NFTTokenUri.toString());
        

    });

    it("Successful Withdraw", async function () {
        let owner = this.signers.admin;
        let stakedAmount = 1000;
        let lockedTime = 4; // 120 sec
        let increasedTime = 30 * 5 // 150 sec

        // approve token trasnfer
        let approveTx = await this.projectToken.connect(owner).approve(this.stakedShare.address, this.maxUint256);
        await approveTx.wait();

        //loked stake
        let stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
        let stakedTX = await stakeTx.wait();

        let eventParams = stakedTX.events?.filter((x) => {
            return (x.event == "Staked")
        })[0].args

        let NFTid = eventParams?.NFTId.toNumber();

        // withdraw stake
        await increaseTime(increasedTime);

        let withdrawTx = await this.stakedShare.connect(owner).withdraw(NFTid);
        await withdrawTx.wait();

        // NFT token was deleted
        await expect(this.stakedShare.connect(owner).tokenURI(NFTid)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

        // Expected 0 Project token balance in StakedShare contract

        let balanceOfRS = await this.projectToken.connect(owner).balanceOf(this.stakedShare.address);
        expect(balanceOfRS.toNumber()).to.equal(0);

    });

    it("Fail Withdraw, your token it is locked", async function () {
        let owner = this.signers.admin;
        let stakedAmount = 1000;
        let lockedTime = 4; // 120 sec
        let increasedTime = 30 * 3 // 90 sec

        // approve token trasnfer
        let approveTx = await this.projectToken.connect(owner).approve(this.stakedShare.address, this.maxUint256);
        await approveTx.wait();

        //loked stake
        let stakeTx = await this.stakedShare.connect(owner).stake(stakedAmount, lockedTime);
        let stakedTX = await stakeTx.wait();

        let eventParams = stakedTX.events?.filter((x) => {
            return (x.event == "Staked")
        })[0].args

        let NFTid = eventParams?.NFTId.toNumber();

        // withdraw stake
        await increaseTime(increasedTime);
        
        // revert expected
        await expect(this.stakedShare.connect(owner).withdraw(NFTid)).to.be.revertedWith("your token it is locked");       
    });


}