# Revenue Share Mechanism for ERC20 Token Projects

Revenue Share Mechanism that use a NFT Token to reward and incentive long term holders and own your liquidity. 

## Goals
- Revenue Share Mechanism (Passive Income).
- Loyalty Program.
- Own your Liquidity.
- Incentive Long Term Holders.
- Build NFT based Community.

### General Model

![alt text](https://github.com/NimrodHunter/Revenue-Share-NTF/blob/master/proposal/diagrams/rs2.png?raw=true)

#### Differences with regular Airdrop model 

- Incentive Long Term Holders.
- Create Loyalty Program.
- Avoid Airdrop Hunters.
- NFT creation (with new open DeFi uses).
- On the Projects side, a percentage of staked TVL can be used for yield farming generating more income.
- The distribution of reward are proportional to how long you stake.
- The percentage of disccounts are proportional to how long you stake.
- The amount of token that your can buy with discount are proportional to how much you staked.


#### Kovan Deploys
##### Tokens

- Mock USDC Token: [0x3182042B07AD39405D2Be2a47cF320252efFF033](0x3182042B07AD39405D2Be2a47cF320252efFF033)
- Mock Aave Token: [0xE3255FAdaF182A813933FEB8c69e3c91937854fD](https://kovan.etherscan.io/address/0xE3255FAdaF182A813933FEB8c69e3c91937854fD)
- Mock Wrap ANC Token: [0x9Ea3c15b70D7af8fA6AFEaC21A26eb2d159e8634](0x9Ea3c15b70D7af8fA6AFEaC21A26eb2d159e8634)
- Mock Spell Token: [0xC2954dB7382500e04881532288A4550810fe9415](0xC2954dB7382500e04881532288A4550810fe9415)
- Mock Uniswap Token: [0x67E1E63527f2129c7b9124a7a1459C9CFcee57f8](0x67E1E63527f2129c7b9124a7a1459C9CFcee57f8)
- Mock Yearn Finance Token: [0x4AB6C4Ef65EA46968180375E8217172Fa12DF1B6](0x4AB6C4Ef65EA46968180375E8217172Fa12DF1B6)

##### Faucet & Oracle
- Faucet: [0x92b44f8aC3eF326882Dfaca16E8D94b3d881bceC](https://kovan.etherscan.io/address/0x92b44f8aC3eF326882Dfaca16E8D94b3d881bceC)
- Fees Oracle: [0x3Ac7832b6f03680ec2e7D3056e60E6B4D6CbF116](https://kovan.etherscan.io/address/0x30A879399cb300E4f32d1fCEFf4F7dAbcE79dE8f)

##### Staked Share
- Staked Share Factory: [0xb57b7a7eBbD1e6f30507498D6D2C07b53391AB4f](https://kovan.etherscan.io/address/0xb57b7a7eBbD1e6f30507498D6D2C07b53391AB4f)
- Staked Share *Implementation*: [0x4F37f255eDD02aBe875f3C92256Ab8f74Bff7a97](https://kovan.etherscan.io/address/0x4F37f255eDD02aBe875f3C92256Ab8f74Bff7a97)
- Aave Staked Share: [0x59fCcFbE3511B0f1286D54935258cB93AcC18E81](https://kovan.etherscan.io/address/0x59fCcFbE3511B0f1286D54935258cB93AcC18E81)
- Anchor Staked Share: [0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83](https://kovan.etherscan.io/address/0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83)
- Spell Staked Share: [0xf775Cf24eB05855639739a1A0D1bB06e80Cecd86](https://kovan.etherscan.io/address/0xf775Cf24eB05855639739a1A0D1bB06e80Cecd86)
- Uniswap Staked Share: [0x23c1603c1Ba3086cD861dFcF1B4b1a2b1C16C979](https://kovan.etherscan.io/address/0x23c1603c1Ba3086cD861dFcF1B4b1a2b1C16C979)
- Yearn Staked Share: [0xB5d5dEfF50Be2Dd649BbDE7Ba31A139cb30678209](https://kovan.etherscan.io/address/0xB5d5dEfF50Be2Dd649BbDE7Ba31A139cb3067820)

##### Revenue Claim

- Revenue Factory: [0x6cdd20B9377BB1BADCA3198D8b4f03A7869B1C7c](https://kovan.etherscan.io/address/0x6cdd20B9377BB1BADCA3198D8b4f03A7869B1C7c)

- Revenue Claim *Implementation*: [0xE8bBA4254fa2EE15a5aa7fbD7a355B45dd03D02D](https://kovan.etherscan.io/address/0xE8bBA4254fa2EE15a5aa7fbD7a355B45dd03D02D7)


##### Rewards

- #1 Aave Revenue 10.000.000 USDC reward: [0x8F2FDE3ADD67180cF43d0D9d615C722Cc08b8b16](https://kovan.etherscan.io/address/0x8F2FDE3ADD67180cF43d0D9d615C722Cc08b8b16)

- #2 Aave Revenue 400.000 Aave reward: [0x78A808Cf328CF313b97e1f3eB0A8b7514Df7704e](https://kovan.etherscan.io/address/0x78A808Cf328CF313b97e1f3eB0A8b7514Df7704e)

- #1 Spell Revenue 40.000.000 USDC reward: [0xda0d08Cf9b09f43a53326CE4A1a534ccC8246d18](https://kovan.etherscan.io/address/0xda0d08Cf9b09f43a53326CE4A1a534ccC8246d18)

- #1 Spell Revenue 40.000.000 USDC reward: [0xda0d08Cf9b09f43a53326CE4A1a534ccC8246d18](https://kovan.etherscan.io/address/0xda0d08Cf9b09f43a53326CE4A1a534ccC8246d18)

- #2 Spell Revenue 25.000 USDC reward: [0x8fd2bA1Ae7d58899b52AE7742fB0F1A999adE6a5](https://kovan.etherscan.io/address/0x8fd2bA1Ae7d58899b52AE7742fB0F1A999adE6a5)

- #3 Spell Revenue 70.000 SPELL reward: [0xA954d83CB55FA469B80D6a7d6f2da2424b9fF0A3](https://kovan.etherscan.io/address/0xA954d83CB55FA469B80D6a7d6f2da2424b9fF0A3)

- #1 Yearn Finance Revenue 1.500.000 YFI reward: [0x94F72DEE54a6a8b464CfbA6d60E94a210f5d4032](https://kovan.etherscan.io/address/0x94F72DEE54a6a8b464CfbA6d60E94a210f5d4032)

