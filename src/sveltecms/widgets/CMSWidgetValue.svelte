<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  let input:HTMLInputElement

  $: if (input) input.parentElement.classList.add('sveltecms-hidden-field')

  $: value = field.widget?.options?.value ?? undefined

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
    class="sveltecms-hidden-field"
    bind:this={input}
    name={id}
    type="hidden"
    bind:value
  />
{/if}

<style>
  :global(.sveltecms div.field.field-type-value.widget-type-value:has(input.sveltecms-hidden-field)) {
    display:none;
  }
  :global(.sveltecms div.field.sveltecms-hidden-field) {
    display:none;
  }
</style>