import { expect } from "chai";
import { increaseTime } from "../utils/utils";

export function shouldBehaveLikeMockToken(): void {
    it("Successful Deployment", async function () { 

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