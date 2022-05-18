<script>
  import Section from "../common/Section.svelte";
  import UploadCSV from 'upload-csv-svelte';
  import {supportedChainIds} from "../../app.config";
  import {airdrops} from "../../stores/airdrops";
  import * as networksDataArray from "../../networks-metadata.json";
  import {networkSigner} from "../../stores/web3";
  import { allocateRewards } from "../../utils/airdrops";
  import {ethers} from "ethers";

  // Select Options
  let networkData;
  let tokenData;

  // Selected data
  let selectedChain;
  let selectedAirdrop;
  let selectedToken;
  let rewardCSVData;

  // Component params
  let canLoadCSV = false;
  let disabled = true;
  let loading = false;

  function initAdmin() {
    const networkList = networksDataArray.default;
    networkData = networkList.filter(
      (x) => supportedChainIds.indexOf(x.chainId) >= 0
    );
  }

  function handleChangeChain() {
    selectedAirdrop = $airdrops[selectedChain.chainId];
    console.log("Selected aidrop: ", selectedAirdrop);

    tokenData = [];
    Object.entries(selectedAirdrop.tokensData).map(
      ([key,value]) => tokenData.push({address: key, symbol: value.symbol})
    );

    console.log("token data available in this network is: ", tokenData);
  }

  function handleChangeToken() {
    console.log("Selected token: ", selectedToken)
    canLoadCSV = true;
  }

  function loadCSV(csvData) {
    rewardCSVData = csvData.slice(1, csvData.length);
    rewardCSVData = rewardCSVData.filter((x) => x.length > 0 && x[0] !== '')
    disabled = false;
    console.log("this is the parsed data converted to CSV: ", rewardCSVData);
  }

  async function onAllocateClick() {
    const toAddresses = []
    const values = []

    // Get addresses, and rewards (adjusted to wei)
    rewardCSVData.map((x) => {
      if( x.length > 0 && parseInt(x[0]) === selectedChain.chainId ) {
        toAddresses.push(x[1]);
        values.push(ethers.utils.parseEther(x[2]));
      }
    });

    console.log(">>>> Allocate funds from <<<<<");
    console.log("Selected chain: ", selectedChain);
    console.log("Selected token: ", selectedToken);
    console.log("To addresses: ", toAddresses);
    console.log("Values: ", values);

    loading = true;

    //TODO - Improve success/error
    await allocateRewards(
      selectedAirdrop,
      toAddresses,
      values,
      selectedToken.address,
      $networkSigner
    );

    loading = false;
  }

  initAdmin()
</script>

<div class="flex h-screen home-container">
  <Section class="flex text-left bg-grey-200"
      title={"Allocate Funds"}
      description={'Use the following dashboard to allocate funds to individual airdrop contracts.'}
      actions={[{
        text: "Allocate",
        onClick: onAllocateClick,
        disabled: disabled,
        loading: loading,
      },
      ]}
  >
    {#if networkData}
      <div>
        <span>1. Select Network</span>
        <select bind:value={selectedChain} on:click={handleChangeChain}>
            {#each networkData as network}
              <option value={network}>
                {network.name}
              </option>
            {/each}
        </select>
      </div>
    {/if}
    {#if tokenData}
      <div>
        <span>2. Select Token</span>
        <select bind:value={selectedToken} on:click={handleChangeToken}>
          {#if tokenData}
            {#each tokenData as token}
              <option value={token}>
                {token.symbol}
              </option>
            {/each}
          {/if}
        </select>
      </div>
    {/if}
    {#if canLoadCSV}
      <div>
        <span>3. Select Rewards.csv file</span>
        <UploadCSV onUpload={(file) => loadCSV(file)} />
      </div>
    {/if}
  </Section>
</div>
