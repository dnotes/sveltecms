<script >export let field;
export let id;
export let value = field.default;
let files;
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
    type="file"
    bind:files={value}
    multiple={field.multiple}
    disabled={field.disabled}
    required={field.required}
  />

</label>