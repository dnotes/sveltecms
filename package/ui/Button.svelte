<script>export let submit = undefined;
export let cancel = undefined;
export let disabled = undefined;
export let small = undefined;
export let borderless = undefined;
export let highlight = undefined;
export let primary = undefined;
export let danger = undefined;
export let helptext = '';
// Some buttons navigate.
// This is easier than making a Link component or using goto.
export let href = undefined;
// This is for the <slot> default
export let text = '';
</script>

{#if href}

<a class="button"
  on:click
  title="{helptext}"
  aria-label="{helptext}"
  {href}
  class:disabled
  class:cancel
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>
<slot>{text}</slot>
</a>

{:else}

<button
  on:click
  title={helptext}
  aria-label="{helptext}"
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:primary
  class:cancel
  class:danger
  class:small
  class:borderless
  class:highlight
>
<slot>{text}</slot>
</button>

{/if}
