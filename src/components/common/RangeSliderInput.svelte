<script>
  import RangeSlider from "svelte-range-slider-pips";

  export let min;
  export let max;
  export let step = 1;
  export let value;
  export let placeholder = 0;
  export let disabled = false;
  export let last = "label";
  export let onChange;

  let selectedRangeColor = "#ff4092";
</script>

<div
  style="--range-handle-focus: {selectedRangeColor}; --range-range: {selectedRangeColor}; --range-handle-inactive:{selectedRangeColor}"
>
  <RangeSlider
    id="color-pips"
    range="min"
    {placeholder}
    values={value}
    {disabled}
    pips
    pipstep={10}
    {min}
    {max}
    all="label"
    suffix="%"
    float
    rest
    {step}
    hoverable
    first
    {last}
    on:change={(e) => {
      onChange(e.detail.value);
    }}
  />
</div>
