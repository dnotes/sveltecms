<script>export let field;
export let id;
export let value;
$: value = field.widget?.options?.value;
</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input type="text" disabled bind:value>
  <input
    name={id}
    type="hidden"
    bind:value
  />
</label>
