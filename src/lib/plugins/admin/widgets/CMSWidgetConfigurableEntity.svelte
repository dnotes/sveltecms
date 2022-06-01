<script lang="ts">
import type { ConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType } from "sveltecms";
import type SvelteCMS from "sveltecms";
import Modal from 'sveltecms/ui/Modal.svelte'
import Button from 'sveltecms/ui/Button.svelte'
import CmsFieldGroup from "sveltecms/CMSFieldGroup.svelte";
import { isEqual, isNull } from "lodash-es";
import { createEventDispatcher } from "svelte";
import yaml from 'js-yaml';

  export let cms:SvelteCMS
  export let type:string // The type of configurable entity being configured
  export let id:string // The 'name' attribute of the form element
  export let items:string[] // The list of items for the select box, or a single entity ID for default items
  let exportedValue:string|ConfigSetting // The config setting exported as value
  export { exportedValue as value }
  export let disabled:boolean = undefined // Whether the select box should be disabled
  export let unset:string = undefined // The label for the unset value
  export let forceEntityID:string = undefined // A single entity ID to force configuration, e.g. for default items

  // For a single item, get the entityID
  if (forceEntityID) {
    items = []
    disabled = true
    unset = forceEntityID
  }

  // the value of the form, including undefined
  let value = exportedValue === undefined ? '' : exportedValue
  $: exportedValue = value === '' ? undefined : value

  // set up the event dispatcher
  const dispatch = createEventDispatcher()

  // opens the modal configuration window
  let fieldgroup

  // variable to hold the option values
  let optionValues

  // check if there is anything to configure
  $: entityID = forceEntityID || value?.['type'] || value
  $: entityType = cms.getEntityType(type, entityID)
  $: optionFields = Object.keys(entityType?.optionFields ?? {})

  function openOptions() {
    optionValues = Object.fromEntries(optionFields.filter(k => value.hasOwnProperty(k)).map(k => ([ k, value?.[k] ])))
    fieldgroup = cms.getEntityConfigFieldgroup(type, entityID)
  }

  // Whenever the modal is closed, set the real value
  function saveOptions() {
    // Get the default config for the configuration
    let defaults = forceEntityID ? cms.getConfigOptionsFromFields(entityType?.optionFields ?? {}) : cms.getEntityConfig(type, entityID)
    // Get any customized values // TODO: test whether we need isEqual instead of !==
    let customizations = Object.entries(optionValues).filter(([k,v]) => (defaults[k] !== v) )
    // Set an array of new values
    let newValueArray = typeof value === 'string' ? [[ 'type', forceEntityID || value ]] : Object.entries(value).filter(([k,v]) => !optionFields.includes(k))
    // Set the new value
    let newValue = Object.fromEntries([...newValueArray, ...customizations])
    // If the new value is only a type, it should be a string
    // If there is a forced entity id, then we are configuring a default entity type, and should return undefined
    if ( isEqual(Object.keys(newValue), ['type']) ) newValue = forceEntityID ? '' : newValue?.['type']
    // TODO: figure out how to remove the "type" field if this is a default entity type
    // Now set the value
    value = newValue
    // And dispatch the change event
    dispatch('change', { value })
    // Close the Modal and unset the optionValues
    fieldgroup=undefined
    optionValues=undefined
  }

</script>

{#if typeof value === 'string' || typeof value === 'undefined' || isNull(value)}
  <select
    name="{id}"
    {disabled}
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
    {disabled}
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

<Button small on:click={openOptions}>...</Button>

{#if fieldgroup}
  <Modal on:cancel={saveOptions}>
    <h2>Configure {type}.{value?.['type'] ?? value}</h2>
    <form on:submit|preventDefault={saveOptions}>
      <CmsFieldGroup {cms} {fieldgroup} bind:values={optionValues} />
    </form>
    <Button primary on:click={saveOptions}>Close</Button>
  </Modal>
{/if}
