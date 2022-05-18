<script lang="ts">

  export let submit:boolean = undefined
  export let disabled:boolean = undefined
  export let small:boolean = undefined
  export let primary:boolean = undefined
  export let danger:boolean = undefined

  // Some buttons navigate.
  // This is easier than making a Link component or using goto.
  export let href:string = undefined

</script>

{#if href}

<a
  on:click
  {href}
  class:disabled
  class:primary
  class:danger
  class:small
>
<slot></slot>
</a>

{:else}

<button
  on:click
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:primary
  class:danger
  class:small
>
<slot></slot>
</button>

{/if}
