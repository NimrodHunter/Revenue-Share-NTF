import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { MockToken } from "../src/types/MockToken";
import type { RevenueShare } from "../src/types/RevenueShare";

declare module "mocha" {
    export interface Context {
        mockToken: MockToken;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
    export interface Context {
        revenueShare: RevenueShare;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
}

export interface Signers {
    admin: SignerWithAddress;
}