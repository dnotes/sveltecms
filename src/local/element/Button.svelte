<script lang="ts">

  export let value
  export let submit:boolean = value?.submit
  export let disabled:boolean = value?.disabled
  export let small:boolean = value?.small
  export let borderless:boolean = value?.borderless
  export let highlight:boolean = value?.highlight
  export let primary:boolean = value?.primary
  export let danger:boolean = value?.danger
  export let helptext:string = value?.helptext || ''

  // Some buttons navigate.
  // This is easier than making a Link component or using goto.
  export let href:string = value?.href

  // This is for the <slot> default
  export let text:string = value?.text || ''

</script>

{#if href}

<a class="button"
  on:click
  title="{helptext}"
  aria-label="{helptext}"
  {href}
  class:disabled
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>
{text}<slot></slot>
</a>

{:else}

<button
  on:click
  title={helptext}
  aria-label="{helptext}"
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>
{text}<slot></slot>
</button>

{/if}
