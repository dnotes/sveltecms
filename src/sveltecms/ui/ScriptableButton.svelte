<script lang="ts">
import { parseScript, ScriptError } from 'sveltecms/core/ScriptFunction';

import type SvelteCMS from 'sveltecms';
import Modal from 'sveltecms/ui/Modal.svelte'
import Button from 'sveltecms/ui/Button.svelte';
import type { WidgetField } from 'sveltecms';

  export let cms:SvelteCMS
  export let value              // the value that is scriptable
  export let field:WidgetField  // the field that is scriptable

  // Informational
  export let isScript = false   // Whether the value is overridden by a script
  export let scriptValue = ''   // the value as a script
  export let overridden = false // whether the value is overridden

  scriptValue = value
  let parsedScriptValue

  let show        // whether the configuration modal is open

  let parsedScript = ''
  let scriptError:Error|ScriptError

  // Whether the script is valid
  $: isScript = Boolean(parsedScript?.toString())

  $: if (scriptValue) {
    if (scriptValue !== parsedScriptValue) {
      parsedScriptValue = scriptValue
      try { parsedScript = parseScript(scriptValue)?.toString() }
      catch(e) { scriptError = e }
    }
  }

  function setOverride() {
    show = false
    if (isScript) {
      value = scriptValue
      overridden = true
    }
  }

  function removeOverride() {
    show = false
    // Remove the override
    if (overridden) {
      overridden = false
      value = field.default
    }
  }

  function fnHelp(fn) {
    return `$${fn.id}(${fn.params.map(p => p.id).join(', ')})
${fn.helptext || 'no helptext available'}

${fn.params.map(p => `${p.multiple ? '...' : ''}${p.id}: ${p.helptext}`).join('\n')}
` }

</script>

<Button small highlight={isScript} on:click={()=>{show=true}}><slot><em>fn</em></slot></Button>

{#if show}
<Modal on:cancel={()=>{show=false}}>
  <h3 slot="title">Script configuration for <code>{field.id}</code></h3>
  <input type="text" class:valid={isScript} bind:value={scriptValue} />
  <div class="script" class:valid={isScript}>
    {#if isScript}
      {parsedScript.toString()}
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
    <Button primary disabled={!isScript} on:click={setOverride}>Save</Button>
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
  }
</style>
