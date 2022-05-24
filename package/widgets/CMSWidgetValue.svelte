<script>export let field;
export let id;
export let value = field.default;
</script>

<input
  name={id}
  type="hidden"
  bind:value
/>
