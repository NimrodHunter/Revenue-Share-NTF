import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { MockToken } from "../src/types/MockToken";
import type { StakedShare } from "../src/types/StakedShare";

declare module "mocha" {
    export interface Context {
        mockToken: MockToken;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
    export interface Context {
        stakedShare: StakedShare;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
}

export interface Signers {
    admin: SignerWithAddress;
}