# Memento Smart Contracts by Castle

**Repository that uses Foundry to explore smart contract wallet and erc 721 token contracts**

### Goals

1. Create a Gnosis Safe wallet with a `string` salt (e.g. twitter handle, email, etc.)
2. Create a simple ERC721 token with a start time, end time, and a max supply

### Contracts

### Getting Started

#### Use Foundry:

This app will not work on a local test network since it relies on contracts that have been deployed by the Safe team (TBD). To test properly, please use `anvil --fork-url $RPC_URL` to run a local node on port 8545 and then when you run your tests, use `forge test -vvv -f http://127.0.0.1:8545`.

```bash 1
RPC_URL = https://eth-mainnet.alchemyapi.io/v2/
anvil --fork-url $RPC_URL
```

```bash 2
forge install
forge test -f http://127.0.0.1:8545
```

### Features

-   Write / run tests with either Hardhat or Foundry:

```bash
forge test
```

-   Install libraries with Foundry which work with Hardhat.

```bash
forge install rari-capital/solmate # Already in this repo, just an example
```

### Deploy

Reach out to [mehran@castle.link](mailto:mehran@castle.link) if you want to know about the entire deployment process (e.g. entry point, eip 4337 manager, wallet factory, and token factory)

Create an `.env` file that has the following fields

```
BLOCK_EXPLORER_API_KEY=BLOCK_EXPLORER_API_KEY
RPC_URL=RPC_URL
ETH_FROM=PUBLIC_ADDRESS
PRIVATE_KEY=PRIVATE_KEY
```

Run the following in the root directory of this project.

```
source .env
forge script -vvvv --froms $ETH_FROM script/Create2SafeFactory.s.sol --fork-url $RPC_URL --broadcast --sender $FROM --verify --etherscan-api-key $BLOCK_EXPLORER_API_KEY
```

### Notes

Whenever you install new libraries using Foundry, make sure to update your `remappings.txt` file by running `forge remappings > remappings.txt`. This is required because we use `hardhat-preprocessor` and the `remappings.txt` file to allow Hardhat to resolve libraries you install with Foundry.

-   Look at https://github.com/eth-infinitism/account-abstraction
-   Look at https://github.com/safe-global/safe-contracts
