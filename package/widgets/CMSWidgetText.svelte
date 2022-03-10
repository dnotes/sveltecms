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
    name={id}
    title={field.tooltip}
    type="text"
    bind:value
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
  />
</label>
