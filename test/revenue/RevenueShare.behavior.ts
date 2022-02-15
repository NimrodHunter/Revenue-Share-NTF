import { expect } from "chai";
import { increaseTime } from "../utils/utils";

export function shouldBehaveLikeRevenueShare(): void {
    it("Successful Deployment", async function () { 
        let owner = this.signers.admin;
        let proyectToken  = await this.revenueShare.connect(owner)._projectToken();
        let rewardToken  = await this.revenueShare.connect(owner)._rewardToken();
        expect(proyectToken.toString()).to.equal(this.mockToken.address);
        expect(rewardToken.toString()).to.equal(this.mockToken.address);
    });

    it("Successful Stake", async function () { 
        let owner = this.signers.admin;
        let stakedAmount = 1000;
        let lockedTime = 4; // weeks

        // approve token trasnfer
        let approveTx = await this.mockToken.connect(owner).approve(this.revenueShare.address, this.maxUint256);
        await approveTx.wait();
        let allowedAmount = await this.mockToken.connect(owner).allowance(owner.address, this.revenueShare.address);
        expect(allowedAmount).to.equal(this.maxUint256);

        //loked stake
        let stakeTx = await this.revenueShare.connect(owner).stake(stakedAmount, lockedTime);
        await stakeTx.wait();

        //Revenue Share contarct received project Tokens
        let revContractBalance = await this.mockToken.connect(owner).balanceOf(this.revenueShare.address);
        expect(revContractBalance.toNumber()).to.equal(stakedAmount);

        //verify the ownership of the first NFT
        let NFTOwner = await this.revenueShare.connect(owner).ownerOf(1);
        expect(NFTOwner.toString()).to.equal(owner.address);

        // Verify Owner balances of NFT
        let NFTBalance = await this.revenueShare.connect(owner).balanceOf(owner.address);
        expect(NFTBalance.toNumber()).to.equal(1);

        let NFTTokenUri = await this.revenueShare.connect(owner).tokenURI(1);
        console.log(NFTTokenUri.toString());
        

    });
/*
    it("Successful Token Transfer To Vesting Contract", async function () { 
        let owner = this.signers.admin;
        let initialBalance = await this.vestedToken.connect(owner).balanceOf(owner.getAddress());
        expect(initialBalance.toNumber()).to.be.a('number');
        expect(initialBalance.toNumber()).to.equal(1000);

        let transferTx = await this.vestedToken.connect(owner).transfer(this.vesting.address, 600);
        await transferTx.wait();

        let contractBalance = await this.vestedToken.connect(owner).balanceOf(this.vesting.address);
        expect(contractBalance.toNumber()).to.be.a('number');
        expect(contractBalance.toNumber()).to.equal(600);
    
    });

    it("Successful First Token Release", async function () {
        let owner = this.signers.admin;

        let transferTx = await this.vestedToken.connect(owner).transfer(this.vesting.address, 600);
        await transferTx.wait();

        await increaseTime(10);

        let releaseTx = await this.vesting.connect(owner)["release(address)"](this.vestedToken.address);
        await releaseTx.wait();

        let contractBalance = await this.vestedToken.connect(owner).balanceOf(this.vesting.address);
        expect(contractBalance.toNumber()).to.be.a('number');
        expect(contractBalance.toNumber()).to.equal(540);
        
        //console.log(a.events?.filter((x) => {return x.event == "ERC20Released"}));
    });

    it("Successful Second Token Release after 180 seconds", async function () {
        let owner = this.signers.admin;

        let transferTx = await this.vestedToken.connect(owner).transfer(this.vesting.address, 600);
        await transferTx.wait();

        await increaseTime(10);

        let releaseTx = await this.vesting.connect(owner)["release(address)"](this.vestedToken.address);
        await releaseTx.wait();

        let contractBalance = await this.vestedToken.connect(owner).balanceOf(this.vesting.address);
        expect(contractBalance.toNumber()).to.be.a('number');
        expect(contractBalance.toNumber()).to.equal(540);

        await increaseTime(190);

        releaseTx = await this.vesting.connect(owner)["release(address)"](this.vestedToken.address);
        await releaseTx.wait();
        expect(contractBalance.toNumber()).to.be.a('number');        
        
    });

    it("Revert if the release is before 180 seconds", async function () {
        let owner = this.signers.admin;

        let transferTx = await this.vestedToken.connect(owner).transfer(this.vesting.address, 600);
        await transferTx.wait();

        await increaseTime(10);

        let releaseTx = await this.vesting.connect(owner)["release(address)"](this.vestedToken.address);
        await releaseTx.wait();

        let contractBalance = await this.vestedToken.connect(owner).balanceOf(this.vesting.address);
        expect(contractBalance.toNumber()).to.be.a('number');
        expect(contractBalance.toNumber()).to.equal(540);

        await increaseTime(30);

        await expect(this.vesting.connect(owner)["release(address)"](this.vestedToken.address)).to.be.revertedWith("already vested")     
        
    });
*/
}