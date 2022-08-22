<script>export let field;
export let id;
export let value = field.default;
$: value = field.widget?.options?.value ?? undefined;
</script>

{#if field.widget?.options?.display}
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
{:else}
  <input
    name={id}
    type="hidden"
    bind:value
  />
{/if}

