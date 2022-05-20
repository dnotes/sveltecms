<script lang="ts">

  export let submit:boolean = undefined
  export let disabled:boolean = undefined
  export let small:boolean = undefined
  export let borderless:boolean = undefined
  export let highlight:boolean = undefined
  export let primary:boolean = undefined
  export let danger:boolean = undefined
  export let helptext:string = ''

  // Some buttons navigate.
  // This is easier than making a Link component or using goto.
  export let href:string = undefined

</script>

{#if href}

<a class="button"
  on:click
  title={helptext}
  {href}
  class:disabled
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>
<slot></slot>
</a>

{:else}

<button
  on:click
  title={helptext}
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>
<slot></slot>
</button>

{/if}
