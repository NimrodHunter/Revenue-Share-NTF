import { expect } from "chai";
import type { Artifact } from "hardhat/types";
import { artifacts, ethers, waffle } from "hardhat";
import type { MockToken } from "../../src/types/MockToken";

export function shouldBehaveLikeStakedShareFactory(): void {
    it("Successful Deployment", async function () { 
        const owner = this.signers.admin;

        const numberOfProjects  = await this.stakedShareFactory.connect(owner).numberOfProjects();
        expect(numberOfProjects).to.equal(0);
    });

    it("create a revenue share for a project", async function () {
        const owner = this.signers.admin;
        const fee = ethers.utils.parseEther("10");

        const implementation = this.stakedShare.address;
        const initialSupply = this.maxUint256;
        let name = "Aave Tokens";
        let symbol = "AAVE";

        const projectTokenArtifact: Artifact = await artifacts.readArtifact("MockToken");
        this.projectToken = <MockToken>await waffle.deployContract(this.signers.admin, projectTokenArtifact, [
            initialSupply,
            name,
            symbol
        ]);

        const projectToken = this.projectToken.address;
        name = "Aave Revenue";
        symbol = "RAAVE";
        const logo = "aave.svg";

        const cloneTx  = await this.stakedShareFactory.connect(owner).stakedShare(implementation, projectToken, name, symbol, logo, {value: fee});
        const clonedTx = await cloneTx.wait();

        const numberOfProjects  = await this.stakedShareFactory.connect(owner).numberOfProjects();
        expect(numberOfProjects).to.equal(1);

        const event = clonedTx.events?.filter((x: { event: string; }) => {
            return (x.event == "Cloned")
        })[0].args

        expect(event.projectToken).to.equal(projectToken);

        const stakedShareContract = this.stakedShare.attach(event.clone);
        
        const pT = await stakedShareContract.connect(owner).projectToken();
        expect(pT).to.equal(projectToken);
        
        const pName = await stakedShareContract.connect(owner).name();
        expect(pName).to.equal(name);

        const pSymbol = await stakedShareContract.connect(owner).symbol();
        expect(pSymbol).to.equal(symbol);

        const pLogo = await stakedShareContract.connect(owner).logo();
        expect(pLogo).to.equal(logo);
    
    });

}