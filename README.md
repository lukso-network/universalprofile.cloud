# 💳 wallet.universalprofile.cloud

## Status

- main [![Lint, Test, Build](https://github.com/lukso-network/wallet.universalprofile.cloud/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lukso-network/wallet.universalprofile.cloud/actions/workflows/ci.yml)

Wallet that will let you see the Tokens ([LSP7](https://docs.lukso.tech/standards/nft-2.0/LSP7-Digital-Asset)) and NFTs ([LSP8](https://docs.lukso.tech/standards/nft-2.0/LSP8-Identifiable-Digital-Asset)) associated to a specific LUKSO's Universal Profile address.

## 🚀 Deployments

This project is deployed via [Cloudflare pages](https://pages.cloudflare.com/).

### Preview

When you create a PR, a preview URL will be appended to the PR discussion.

### Production

Branch: `main`

- <https://wallet.universalprofile.cloud/>

## 🔌 Network switch

It is possible to pass a network in query parameter to force viewing a profile on a given network:

```
?network=testnet
?network=mainnet
```

## Debug Logs

At runtime we look at the Local Storage "debug" key to show various logs. The following log streams are
available:

- `wallet:asset` -> Show asset/token objects
- `wallet:profile` -> Show profile objects
- `tanstack:query` -> Show how queries as posted
- `tanstack:results` -> Show results of queries

You can use \* for any section or all. For example:

- `debug=\*`
- `debug=wallet:\*,tanstack:query`
- `debug=wallet:,tanstack:`

Use the Chrome debugger to add it to LocalStorage for the wallet site URL.

## 🧑🏻‍💻 Getting Started

Install packages:

```sh
yarn install
```

Run the development server:

```sh
yarn dev
```

Check the code:

```sh
yarn lint
yarn test
```

Preview the production build:

```sh
yarn preview
```

### Translations

App use [Yata](https://www.yatapp.net/), a third party website for managing translations. Do not edit `json` files for translations manually as they will be overwritten when fetching from Yata.

> Please first set `YATA_API_TOKEN` as an environment variable or locally in the root folder `.env` file (see `.env.example`).

For generating translations use following script:

```sh
yarn yata-fetch
```

### Using local [`tools-web-components`](https://github.com/lukso-network/tools-web-components)

This repo will look for `../tools-web-components/package` to turn on linking.

To link please run

```sh
yarn link -p ../tools-web-components/package
```

To unlink please run

```sh
yarn unlink ../tools-web-components/package
```

> Make sure you remove link before pushing, otherwise it won't build in Cloudflare.

### Releasing

We use single branch flow. Just merge your feature PR into `main` branch and new release will be triggered.
