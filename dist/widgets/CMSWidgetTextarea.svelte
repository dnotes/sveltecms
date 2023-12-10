<script>import { onMount } from "svelte";
export let field;
export let id;
export let value = field.default;
//@ts-ignore
let opts = field.widget.options;
let styles = [
    'height:auto'
];
if (opts.autosize)
    styles.push('overflow:hidden');
if (opts.resize)
    styles.push(`resize:${opts.resize}`);
let el;
onMount(() => {
    autosize();
});
function autosize() {
    if (opts.autosize) {
        el.style.height = "auto";
        el.style.height = (el.scrollHeight + 2) + 'px';
    }
}
</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <textarea
    name={id}
    title={field.helptext}
    bind:value
    bind:this={el}
    on:input={autosize}
    rows="{opts?.rows ?? undefined}"
    cols="{opts?.cols ?? undefined}"
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
    style="{styles.join(';')}"
  />
</label>
