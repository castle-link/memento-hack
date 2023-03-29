# Memento

Mint and collection web3 media with just an email address

### Prerequisites

- yarn
- Node version manager (NVM) or node version 16.x
- Redis client

## Setup

First, run the development server:

```bash
git clone git@github.com:Castle-Link/memento-hack.git
cd memento-hack

nvm install # if using NVM
yarn
```

### Setup Enviroment Variables

Create an env file at in the root directory called:
.env.local (for local)
.env.prod (for prod)

Use .env.example as a reference for required env vars

### Setup a database

MongoDB is used for keeping record of users, mementos, claims, and transactions

Install mongo db locally

```
brew install mongodb-community
brew services start mongodb-community
```

### Setup Authentication

The following providers are support for user authentication. By default Web3auth with @safe-global/authKit is used. This can be changed by changing the `providerApplication` and `providerMethod` parameters provided in the `connectUser` function

#### Web3auth with @safe-global/authKit (Simplest)

1. Create a web3auth account with web3auth.
2. Set env vars `NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID` and `NEXT_PUBLIC_WEB3_AUTH_NETWORK`

#### Web3auth with the no modal SDK (Full UI control)

1. Create a web3auth account with web3auth.
2. Setup a custom JWT verifier (https://web3auth.io/docs/auth-provider-setup/byo-jwt-providers)
   - set `kid` to `WEB3_AUTH_VERIFIER_KEY_ID` when prompted
3. Create an private key with and encrypt it with `WEB3_AUTH_VERIFIER_ENCRYPTION_PASSPHRASE`
4. Export the encrypted private key to a pem file at `src/lib/web3auth/privateKey.pem`
5. Set `NEXT_PUBLIC_WEB3_AUTH_NETWORK`, `NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID`, `WEB3_AUTH_VERIFIER_KEY_ID`, and `WEB3_AUTH_VERIFIER_ENCRYPTION_PASSPHRASE`

#### magic.link

1. Create magic link account at magic.link
2. Set env vars `NEXT_PUBLIC_MAGIC_API_KEY` and `MAGIC_API_SECRET`

### Stripe setup

1. Create a stripe account
2. Add your API keys
3. Create a webhook that points to [domain]/api/webhooks/stripe that subscribes to the following events:
   - checkout.session.async_payment_failed
   - checkout.session.completed
   - checkout.session.async_payment_succeeded
   - checkout.session.expired

### Run locally

```
yarn dev
```

The app will run at http://localhost:3000

### Running background jobs

Jobs are run in the background to update the db with transaction hashes once Gelato has processed a transaction. Backround tasks are handled with [Bull](https://docs.bullmq.io/) and [ioredis](https://github.com/luin/ioredis)

For local development, you'll need to install redis

```
brew install redis
brew services start redis
```

With redis installed, you can run the background jobs with:

```
yarn build:workers
yarn run:workers
```

Each time a worker is updated, you will need to run `yarn build:workers` again

# Contracts

Custom smart contracts were developed for this hack. You can find them in the `contracts` folder in the root directory. The contracts were developed with Foundry.
