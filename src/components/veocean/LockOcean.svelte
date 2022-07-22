<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import TokenApproval from "../common/TokenApproval.svelte";
  import { getOceanBalance, userBalances } from "../../stores/tokens";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { lockOcean } from "../../utils/ve";
  import * as yup from "yup";
  import { Form, isInvalid } from "svelte-yup";

  let multiplier = 0;
  let apy = 0;
  let currentDate = new Date();
  let loading = true;
  let submitted = false;

  $: if ($userAddress) {
    loading = false;
  }

  const onSubmit = () => {
    submitted = true;
    console.log(schema.isValidSync(fields));
    console.log(fields.amount, fields.unlockDate);
    if (!schema.isValidSync(fields)) return;
    //lockOcean(userAddress, fields.amount, fields.unlockDate);
  };

  let schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is requred")
      .min(1)
      .max()
      .label("Amount"),
    unlockDate: yup
      .date()
      .required("Unlock date is requred")
      .label("Unlock Date"),
  });
  let fields = {
    amount: undefined,
    unlockDate: currentDate.toLocaleDateString("en-CA"),
  };
  $: invalid = (name) => {
    if (submitted) {
      return isInvalid(schema, name, fields);
    }
    return false;
  };
  $: if ($connectedChainId) {
    console.log(getOceanTokenAddressByChainId($connectedChainId));
  }
</script>

<div class={`container`}>
  <Card title="Lock OCEAN to get veOCEAN">
    <Form class="content" {schema} {fields} submitHandler={onSubmit}>
      <div class="item">
        <Input
          type="number"
          error={invalid("amount")}
          label="How much do you want to lock?"
          direction="column"
          bind:value={fields.amount}
        />
      </div>
      <div class="item">
        <Input
          type="date"
          label="Lock until"
          error={invalid("unlockDate")}
          direction="column"
          min={new Date().toLocaleDateString("en-CA")}
          max={new Date(
            currentDate.setFullYear(currentDate.getFullYear() + 4)
          ).toLocaleDateString("en-CA")}
          bind:value={fields.unlockDate}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Votin power multiplier`}
            value={loading || `${parseFloat(multiplier).toFixed(1)} X`}
          />
          <ItemWithLabel
            title={`APY`}
            value={loading || `${parseFloat(apy)}%`}
          />
        </div>
      </div>
      <div class="item">
        <TokenApproval
          tokenAddress={""}
          tokenName={""}
          poolAddress={""}
          amount={""}
          disabled={""}
          bind:loading
        >
          <Button
            text={loading ? "Locking" : "Lock OCEAN"}
            disabled={loading}
            type="submit"
          />
        </TokenApproval>
      </div>
    </Form>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .output-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .item {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 3);
    display: flex;
    justify-content: center;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
