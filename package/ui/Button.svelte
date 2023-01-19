<script>export let submit = undefined;
export let disabled = undefined;
export let small = undefined;
export let borderless = undefined;
export let highlight = undefined;
export let primary = undefined;
export let danger = undefined;
export let helptext = '';
export let type = undefined;
// Some buttons navigate.
// This is easier than making a Link component or using goto.
export let href = undefined;
// This is for the <slot> default
export let text = '';
let html;
$: if (type) {
    if (type === 'cancel')
        html = "&times;";
    if (type === 'configure')
        html = "<b>&middot;&middot;&middot;</b>";
    if (type === 'fn')
        html = "<i>fn</i>";
}
</script>

{#if href}

<a class="button"
  on:click
  title="{helptext}"
  aria-label="{helptext}"
  {href}
  class:disabled
  class:type
  data-type={type}
  class:primary
  class:danger
  class:small
  class:borderless
  class:highlight
>{#if type}<slot>{@html html}</slot>{:else}<slot>{text}</slot>{/if}</a>

{:else}

<button
  on:click
  title={helptext}
  aria-label="{helptext}"
  type={ submit ? 'submit' : 'button'}
  {disabled}
  class:disabled
  class:primary
  class:type
  data-type={type}
  class:danger
  class:small
  class:borderless
  class:highlight
>{#if type}<slot>{@html html}</slot>{:else}<slot>{text}</slot>{/if}</button>

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
  padding: 1px 4px;
  line-height: 1em;
  min-height: 20px;
  min-width: 20px;
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

.type {
  border-radius: 100%;
  padding: 0;
}
.type:not(.small) {
  height: 40px;
  line-height: 30px;
  min-width: 40px;
  font-size: 28px;
}
.type.small {
  height:22px;
  min-width:22px;
}
.type[data-type="fn"]:not(.small) {
  font-size: 20px;
}
.type[data-type="cancel"] {
  font-size:42px;
  line-height:30px;
}
.small[data-type="cancel"] {
  font-size:21px;
  line-height:20px;
}

.danger {
  background: var(--cms-danger);
  border: 1px solid var(--cms-bg);
}</style>