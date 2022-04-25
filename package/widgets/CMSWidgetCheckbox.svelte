<script>export let field;
export let id;
export let value = field.default;
let opts = field.widget.options;
</script>

<label>
  {#if opts?.labelBeforeCheckbox}
    <span>
      <slot>{field.label}</slot>
    </span>
  {/if}
  <input
    name={id}
    title={field.tooltip}
    type="checkbox"
    bind:checked={value}
    disabled={field.disabled}
    required={field.required}
  />
  {#if !opts?.labelBeforeCheckbox}
    <span>
      <slot>{field.label}</slot>
    </span>
  {/if}
</label>
