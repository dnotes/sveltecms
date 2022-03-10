<script >export let field;
export let id;
export let value = field.default;
//@ts-ignore
let opts = field.widget.options;
</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input
    name="{id}"
    type="number"
    title="{field.tooltip}"
    bind:value
    min={opts?.min}
    max={opts?.max}
    step={opts?.step}
    disabled={field.disabled}
    required={field.required}
  />
</label>
