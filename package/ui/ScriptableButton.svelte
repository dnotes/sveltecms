<script>import { parseScript, ScriptError } from '../core/ScriptFunction';
import Modal from './Modal.svelte';
import Button from './Button.svelte';
import { onMount } from 'svelte';
export let cms;
export let id;
export let value; // the value that is scriptable
export let field; // the field that is scriptable
// Informational
let scriptValue = (value && typeof value === 'string') ? parseScript(value).toString() : ''; // the value as a script
let overridden = Boolean(scriptValue); // whether the value is overridden
let fieldValue = overridden ? field.default : value; // the value as a standard field value
let newScriptValue = ''; // the value of the script input in the modal window
let newScriptValueParsed = ''; // the new script as evaluated by the script parser
let newScriptValueValid = false; // whether the new script is valid
$: if (newScriptValue) {
    try {
        newScriptValueParsed = parseScript(newScriptValue).toString();
        newScriptValueValid = Boolean(newScriptValueParsed);
    }
    catch (e) {
        newScriptValueParsed = '';
        newScriptValueValid = false;
    }
}
$: if (!overridden) {
    value = fieldValue;
}
let show = false; // whether the configuration modal is open
let el; // the element that holds the form widget input
onMount(() => {
    // @ts-ignore should be fine for input / select
    el.parentElement.querySelectorAll('input,select').forEach(e => { if (overridden) {
        e.indeterminate = true;
        e.disabled = true;
    } });
});
function showModal() {
    newScriptValue = scriptValue;
    show = true;
}
function setOverride() {
    scriptValue = newScriptValue;
    overridden = true;
    value = scriptValue;
    // @ts-ignore should be fine for input / select
    el.parentElement.querySelectorAll('input,select').forEach(e => { e.indeterminate = true; e.disabled = true; });
    show = false;
}
function removeOverride() {
    scriptValue = newScriptValue;
    overridden = false;
    // @ts-ignore should be fine for input / select
    el.parentElement.querySelectorAll('input,select').forEach(e => { e.indeterminate = false; e.disabled = field.disabled; });
    show = false;
}
function fnHelp(fn) {
    return `$${fn.id}(${fn.params.map(p => p.id).join(', ')})
${fn.helptext || 'no helptext available'}

${fn.params.map(p => `${p.multiple ? '...' : ''}${p.id}: ${p.helptext}`).join('\n')}
`;
}
</script>

<input type="hidden" name="{id}" bind:value bind:this={el}>
<svelte:component
  this={field.widget.widget}
  {field}
  id=""
  {cms}
  bind:value={fieldValue}
/>
<Button
  small
  highlight={overridden}
  on:click={showModal}
  helptext="{overridden ? scriptValue : 'Use a dynamic function'}"
  disabled={field.disabled}
>
  <slot>
    <em>fn</em>
  </slot>
</Button>


{#if show}
<Modal on:cancel={()=>{show=false}}>
  <h3 slot="title">Script configuration for <code>{field.id}</code></h3>
  <input type="text" class:valid={newScriptValueValid} bind:value={newScriptValue} />
  <div class="script" class:valid={newScriptValueValid}>
    {#if newScriptValueValid}
      {newScriptValueParsed.toString()}
    {:else}
      <em>invalid script</em>
    {/if}
  </div>
  <div class="help">
    <h3>Help</h3>
    <div class="vals">
      <code><a href="#_" on:click|preventDefault>$value</a></code><div>The value of this field in the content item</div>
      <code><a href="#_" on:click|preventDefault>$values.<em>id</em></a></code><div>The value of a different field in the content item</div>
      <code><a href="#_" on:click|preventDefault>$prop</a></code><div>The value of this field property</div>
      <code><a href="#_" on:click|preventDefault>$props.<em>id</em></a></code><div>The value of a different field property</div>
    </div>
    <h4>Functions:</h4>
    <div class="fns">
        {#each cms.scriptFunctionHelp as fn}
        <code>
          <a href="#_" title={fnHelp(fn)} on:click|preventDefault>${fn.id}</a>
        </code>
        {/each}
    </div>
  </div>
  <div class="actions">
    <Button primary disabled={!newScriptValueValid} on:click={setOverride}>Save</Button>
    {#if overridden}
      <Button on:click={removeOverride}>Remove</Button>
    {/if}
    <Button borderless on:click={()=>{show=false}}>cancel</Button>
  </div>
</Modal>
{/if}

<style>
  a {
    text-decoration: none;
  }
  input {
    font-family: monospace;
    width: 100%;
  }
  input.valid {
    font-weight: bold;
    color: var(--cms-main)
  }
  .script {
    text-align: left;
    font-size: 75%;
    opacity: .5;
    padding: .5em 0;
  }
  .script.valid {
    font-family: monospace;
    opacity: 1;
  }
  .help {
    text-align: left;
    opacity: 0.8;
    display: block;
    overflow-y:scroll;
  }
  .vals {
    display:grid;
    gap: 6px 10px;
    grid-template-columns: 95px auto;
  }
  .fns {
    display: grid;
    gap: 6px 10px;
    color: var(--cms-main);
    grid-template-columns: repeat(4, 1fr);
  }
  .actions {
    padding: 2em;
    display: flex;
    gap: 10px;
    justify-content: center;
  }</style>
