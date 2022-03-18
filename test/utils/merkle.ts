import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import  { MerkleTree } from 'merkletreejs';

export interface NFT {
    id: BigNumberish;
    createAt: BigNumberish;
    locked: BigNumberish;
    amount: BigNumberish
    reward?: BigNumberish;
}

export const projectNFTs = async (owner: SignerWithAddress, nftContract: any) => {
    let nfts = [];
    let ids = await nftContract.connect(owner).rsId();
    ids = ids.toNumber();
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
        if (ids > 0) {
        for (let i = 1; i <= ids; i++) {
            let nft = await nftContract.connect(owner).rsToken(i);
            nft = {
                "id": i.toString(),
                "createAt": nft[0].toString(),
                "locked": nft[1].toString(),
                "amount": nft[2].toString()
            };
            if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
        }
    }
    return {"block": blockNumber, nfts};
}

export const projectNFTsByBlock = async (owner: SignerWithAddress, nftContract: any, blockNumber: number) => {
    let nfts = [];
    let ids = await nftContract.connect(owner).rsId();
    ids = ids.toNumber();
    const block = await ethers.provider.getBlock(blockNumber);
        if (ids > 0) {
        for (let i = 1; i <= ids; i++) {
            let nft = await nftContract.connect(owner).rsToken(i);
            nft = {
                "id": i.toString(),
                "createAt": nft[0].toString(),
                "locked": nft[1].toString(),
                "amount": nft[2].toString()
            };
            if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
        }
    }
    return {"block": blockNumber, nfts};
}

export const addReward = (nfts: NFT[]) => {
    if (nfts.length === 1) {
        nfts[0].reward = 1000000;
        return nfts;
    }

    let totalAmount = ethers.BigNumber.from("0");
    let totalLocked = ethers.BigNumber.from("0");

    nfts.map(nft => {
        totalAmount = totalAmount.add(nft.amount);
        totalLocked = totalLocked.add(nft.locked);
    })

    nfts.map((nft) => {
        const amountPiece = ethers.BigNumber.from(nft.amount).mul(1000000).div(totalAmount);
        const lockedPiece = ethers.BigNumber.from(nft.locked).mul(1000000).div(totalLocked);
        nft.reward = amountPiece.mul(75).div(100).add(lockedPiece.mul(25).div(100)).toNumber()
    });

    return nfts;
}

export const createMerkleTree = (nfts: NFT[]) => {
    const leaves = nfts.map(nft => {
        return ethers.utils.solidityKeccak256(["uint256", "uint256"], [nft.id, nft.reward]);
    })
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });
    return tree.getHexRoot();
}

export const proof = (nfts: NFT[], id: BigNumberish) => {
    const nft = nfts.find(nft => nft.id.toString().localeCompare(id.toString()) === 0);
    const leaf = ethers.utils.solidityKeccak256(["uint256", "uint256"], [nft?.id, nft?.reward]);
    const leaves = nfts.map((nft) => {
        return ethers.utils.solidityKeccak256(["uint256", "uint256"], [nft.id, nft.reward]);
    })
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });
    const proof = tree.getHexProof(leaf)

    return { proof, leaf };
}