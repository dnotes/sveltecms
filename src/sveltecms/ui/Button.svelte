<script lang="ts">

  export let submit:boolean = undefined
  export let cancel:boolean = undefined
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

  // This is for the <slot> default
  export let text:string = ''

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
>{#if cancel}<slot>&times;</slot>{:else}<slot>{text}</slot>{/if}</a>

{:else}

<button
  on:click
  title={helptext}
  aria-label="{helptext}"
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:disabled
  class:primary
  class:cancel
  class:danger
  class:small
  class:borderless
  class:highlight
>{#if cancel}<slot>&times;</slot>{:else}<slot>{text}</slot>{/if}</button>

{/if}

<style>
button,
.button {
  font-family: var(--cms-font);
  font-size: 90%;
  text-decoration:none;
  cursor:pointer;
  color:var(--cms-main);
  border-color:var(--cms-main);
  background:transparent;
  padding: 0 .8em;
  line-height: 2.2em;
  border-radius: 1em;
  border: 2px solid var(--cms-main);
  display: inline-block;
  text-transform: lowercase;
}
.small {
  font-size: 80%;
  border-width: 1px;
  padding:1px 4px;
  line-height:1em;
}

.primary,
.highlight,
.danger,
button[type="submit"] {
  background: var(--cms-main);
  color: var(--cms-bg);
  border: none;
  padding-top: 1px;
}

.primary,
.danger,
button[type="submit"] {
  font-weight: bold;
}

.primary {
  text-transform: uppercase;
}

.disabled,
button[type="submit"]:disabled {
  cursor: default;
  opacity: .5;
  filter: grayscale(100%);
}

.borderless {
  border:none !important;
}

.cancel {
  font-size:41px;
  line-height:31px;
  padding: 0 4px;
  border-radius: 100%;
}
.cancel.small {
  font-size:21px;
  line-height:20px;
  padding: 0 4px;
}

.danger {
  background: var(--cms-danger);
}

</style>