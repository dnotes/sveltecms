<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms'
import Modal from 'sveltecms/ui/Modal.svelte'
import CMSField from 'sveltecms/CMSField.svelte'
import { parseScript, type ScriptFunctionConfig } from 'sveltecms/core/ScriptFunction';

  export let cms:SvelteCMS
  export let field:WidgetField|{ disabled?:boolean|ScriptFunctionConfig, id?:string } = { }
  export let id:string = field?.['id']
  export let disabled:boolean|ScriptFunctionConfig = field?.['disabled']

  export let value

  let isScript = parseScript(value)

  let overridden
  let configuring

  let staticValue=
  let scriptValue

  function toggleOverride() {
    // Remove the override
    if (overridden) {
      overridden = false
      field.disabled = disabled
      value =
    }
    // Set the override
    else {
      overridden = true
      field.disabled = true

    }
  }

</script>

<slot>
  {#if field.type}
    <CMSField {cms} id="_{id}" {field} bind:value />
  {/if}
</slot>

{#if configuring}
  <Modal>
    <h2>Configure script for </h2>
    <input type="text" size="50" bind:value={script} />
  </Modal>
{/if}
