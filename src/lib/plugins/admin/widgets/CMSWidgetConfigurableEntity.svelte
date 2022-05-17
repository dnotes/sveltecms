<script lang="ts">
import type { ConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType } from "sveltecms";
import type SvelteCMS from "sveltecms";
import Modal from 'sveltecms/components/Modal.svelte'
import CmsFieldCollection from "sveltecms/CMSFieldCollection.svelte";
import { isEqual, isNull } from "lodash-es";
import { createEventDispatcher } from "svelte";

  export let cms:SvelteCMS
  export let type:string // The type of configurable entity being configured
  export let id:string // The base id for the form element
  export let items:string[] // The list of items for the select box
  let exportedValue:string|ConfigSetting // The config setting exported as value
  export { exportedValue as value }
  export let unset:string = undefined // The label for the unset value

  // the value of the form, including undefined
  let value = exportedValue === undefined ? '' : exportedValue
  $: exportedValue = value === '' ? undefined : value

  // set up the event dispatcher
  const dispatch = createEventDispatcher()

  // opens the modal configuration window
  let collection

  // variable to hold the option values
  let optionValues

  // check if there is anything to configure
  $: optionFields = Object.keys(cms.getEntityType(type, (value?.['type'] || value))?.optionFields || {})
  $: hasOptionFields = optionFields.length > 0

  function openOptions() {
    optionValues = Object.fromEntries(optionFields.filter(k => value.hasOwnProperty(k)).map(k => ([ k, value?.[k] ])))
    collection = cms.getEntityConfigCollection(type, (value?.['type'] ?? value))
  }

  // Whenever the modal is closed, set the real value
  function saveOptions() {
    let defaults = cms.getEntityConfig(type, value?.['type'] || value)
    let customizations = Object.entries(optionValues).filter(([k,v]) => (defaults[k] !== v) )
    let newValueArray = typeof value === 'string' ? [[ 'type', value ]] : Object.entries(value).filter(([k,v]) => !optionFields.includes(k))
    let newValue = Object.fromEntries([...newValueArray, ...customizations])
    if ( isEqual(newValue, { type: newValue?.['type'] }) ) newValue = newValue?.['type']
    value = newValue
    dispatch('change', { value: exportedValue })
    collection=undefined
    optionValues=undefined
  }

  $: console.log(value)

</script>

{#if typeof value === 'string' || typeof value === 'undefined' || isNull(value)}
  <select
    name="{id}"
    bind:value>

    {#if unset}
      <option value="">{unset}</option>
    {/if}
    {#each items as e}
      <option value={e}>{e}</option>
    {/each}

  </select>
{:else}
  <select
    name="{id}[type]"
    bind:value={value['type']}>

    {#if unset}
      <option value="">{unset}</option>
    {/if}
    {#each items as e}
      <option value={e}>{e}</option>
    {/each}

  </select>
  {#each Object.keys(value) as k}
    {#if k !== 'type'}
      <input type="hidden" name="{id}[{k}]" value="{value[k]}">
    {/if}
  {/each}
{/if}

{#if hasOptionFields}
  <button type="button" on:click={openOptions}>...</button>
  <div class="cms-tooltip">
    {#if typeof value === 'string'}
      default
    {:else}
      customized
    {/if}
  </div>
{:else}
  <p class="cms-tooltip">This entity has no configuration.</p>
{/if}

{#if collection}
  <Modal on:cancel={saveOptions}>
    <h2>Configure {type}.{value?.['type'] ?? value}</h2>
    <form on:submit|preventDefault={saveOptions}>
      <CmsFieldCollection {cms} {collection} bind:values={optionValues} />
    </form>
    <button type="button" class="primary" on:click={saveOptions}>Close</button>
  </Modal>
{/if}

<style>
  select { padding-right:20px; }
  .primary { margin:1em auto 0; display:block; }
</style>