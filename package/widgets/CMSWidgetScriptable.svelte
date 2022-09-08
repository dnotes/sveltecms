<script>import { parseScript } from '../core/ScriptFunction';
import Modal from '../ui/Modal.svelte';
import CMSField from '../CMSField.svelte';
import Button from '../ui/Button.svelte';
export let cms;
export let field = {};
export let id = field?.['id'];
export let disabled = field?.['disabled'];
export let value;
let functionIDs = Object.keys(cms.scriptFunctions).sort();
let functionParams = Object.keys(cms.scriptFunctions).sort().map(fn => Object.keys(cms.scriptFunctions[fn].optionFields || {}));
let isScript = parseScript(value);
let overridden;
let show;
let scriptValue = '';
let originalValue;
function toggleOverride() {
    // Remove the override
    if (overridden) {
        overridden = false;
        field.disabled = disabled;
        value = originalValue || field?.['default'];
    }
    // Set the override
    else {
        overridden = true;
        field.disabled = true;
        value = scriptValue;
    }
}
</script>

<slot>
  {#if field?.['type']}
    <CMSField {cms} id="_{id}" {field} bind:value />
  {/if}
</slot>
