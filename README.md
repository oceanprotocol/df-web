_Psst — looking for a more complete solution? Check out [SvelteKit](https://kit.svelte.dev), the official framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing._

_Looking for a shareable component template instead? You can [use SvelteKit for that as well](https://kit.svelte.dev/docs#packaging) or the older [sveltejs/component-template](https://github.com/sveltejs/component-template)_

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

_Note that you will need to have [Node.js](https://nodejs.org) installed._

## Environment variables

The `.env` file is used to differentiate the staging params from the production params.
In order to get the app working create a `.env` in the root of the project directory, and add the following env variables:

**Subgraph URLs:**
Dev = http://172.15.0.15:8000/subgraphs/name/oceanprotocol/ocean-subgraph
Staging = https://v4.subgraph.rinkeby.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph
Production = https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph


```js
// Enable when you want to debug rollup?
// ROLLUP_WATCH = true

//list of suppoerted chainIDs
SUPPORTED_CHAIN_IDS = [3, 4, 1287, 80001]

//api endpoint to get the pools list
BACKEND_API = https://test-df-sql.oceandao.org/pools

//rewards config containing the airdrop contracts and token addresses for each network
AIRDROP_CONFIG = {\"NETWORK_ID":{\"dfRewardsAddress\":\"DF_REWARDS_ADDRESS\",\"feeDistributorAddress\":\"FEE_DISTRIBUTOR_ADDRESS\",\"tokensData\":{\"TOKEN_ADDRESS\":{\"symbol\":\"TOKEN_SYMBOL\"}}}

// your infura key
INFURA_KEY = 01SAMPLE9234KEY

// chain where ve contracts are deployed - 8996 is development
VE_SUPPORTED_CHAINID = 8996

// choose one of the following local subgraph (dev), rinkeby (staging), and mainnet (prod)
SUBGRAPH_API = subgraph_url

// you can get the following addresses from barge @ address.json to develop locally
VE_OCEAN_CONTRACT = 0x...
VE_ALLOCATE_CONTRACT = 0x...
VE_DELEGATION_CONTRACT = 0x...
VE_FEE_DISTRIBUTOR_CONTRACT = 0x...
VE_FEE_ESTIMATE_CONTRACT = 0x...
```

You may also need to update the following files in code to configure your environment.

1. Update `oceanTokenAddressesByChain` inside `src/utils/tokens.js` w/ the OCEAN token address

## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for _any_ path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

If you want to use `baseUrl` or `path` aliases within your `tsconfig`, you need to set up `@rollup/plugin-alias` to tell Rollup to resolve the aliases. For more info, see [this StackOverflow question](https://stackoverflow.com/questions/63427935/setup-tsconfig-path-in-svelte).

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
