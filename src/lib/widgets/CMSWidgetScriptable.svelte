<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms'

import { parseScript, type ScriptFunctionConfig } from 'sveltecms/core/ScriptFunction';

import Modal from 'sveltecms/ui/Modal.svelte'
import CMSField from 'sveltecms/CMSField.svelte'
import Button from 'sveltecms/ui/Button.svelte';

  export let cms:SvelteCMS
  export let field:WidgetField|{ disabled?:boolean|ScriptFunctionConfig, id?:string } = { }
  export let id:string = field?.['id']
  export let disabled:boolean|ScriptFunctionConfig = field?.['disabled']

  export let value

  let functionIDs = Object.keys(cms.scriptFunctions).sort()
  let functionParams = Object.keys(cms.scriptFunctions).sort().map(fn => Object.keys(cms.scriptFunctions[fn].optionFields || {}))

  let isScript = parseScript(value)

  let overridden
  let show

  let scriptValue = ''
  let originalValue

  function toggleOverride() {
    // Remove the override
    if (overridden) {
      overridden = false
      field.disabled = disabled
      value = originalValue || field?.['default']
    }
    // Set the override
    else {
      overridden = true
      field.disabled = true
      value = scriptValue
    }
  }

</script>

<slot>
  {#if field?.['type']}
    <CMSField {cms} id="_{id}" {field} bind:value />
  {/if}
</slot>
