import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'

export const increaseTime = async (seconds: BigNumberish) => {
    const now = (await ethers.provider.getBlock('latest')).timestamp
    await ethers.provider.send('evm_mine', [
        ethers.BigNumber.from(seconds).add(now).toNumber(),
    ])
}