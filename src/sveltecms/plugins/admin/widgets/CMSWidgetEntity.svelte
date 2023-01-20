<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { ConfigSetting, EntityConfigSetting, WidgetField, WidgetFieldFieldgroup } from "sveltecms";

import { cloneDeep, isEqual, isNull } from "lodash-es";
import { createEventDispatcher } from "svelte";
import CmsFieldGroup from "sveltecms/CMSFieldGroup.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";
import CmsWidgetDisplayList from "./CMSWidgetDisplayList.svelte";

import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";
import CmsField from "sveltecms/CMSField.svelte";
import type { FullEntityDisplayConfig } from "sveltecms/core/Display";

  export let cms:SvelteCMS
  export let id:string
  export let value:string|EntityConfigSetting
  export let field:WidgetField = undefined
  // @ts-ignore
  export let options:{
    entityType:string   // The type of entity being configured
    fieldType?:string    // The field "type" value, for when choosing a widget
    skipDetail?:boolean   // Whether to skip rendering the detail fields (i.e. for a new entity in a list)
    isTopLevelEntity?:boolean // Whether this widget is configuring a top-level entity, e.g. cms.fields
    placeholder?:string
  } = field?.widget?.options || {}
  let opts = { ...(field?.widget?.options || {}), ...options}
  $: opts = { ...(field?.widget?.options || {}), ...options}

  // This widget is used in two circumstances: as one property of a config setting, or as part of a list.
  // As a property of a config setting, e.g. a property of a FieldConfigSetting, it would NOT have an entityID, only a value.
  // As part of a list, e.g. when specifying fields for a ContentType, it would have both an entityID and a value.
  export let entityID:string|null = null

  // Whether this is a nested EntityWidget, within an Entity field that handles multiple entries
  export let nested:boolean = false

  // The ID element, for focus operations
  export let idElement:HTMLElement = undefined

  // Exports used specifically by direct calls from CMSWidgetDisplayList
  export let label:string = undefined

  // The entity type template. See EntityTemplate.ts
  let entityType = cms.getEntityType(opts.entityType)

  // Whether the entity has a type field
  let isTyped = entityType.typeField ? true : false

  // Whether the entity is multiple
  let isMultiple = field?.multiple

  // The main "type" field for the entityType -- usually "type", but may be another field
  // This is the field that will be populated if a configuration value is a string
  let entityTypeFieldID = typeof entityType?.typeField === 'string' ? entityType.typeField : 'type'

  // The parent entity, used for getting the
  let parentEntity = undefined

  // The full config of the entity
  value = value ?? field?.default

  // The conf variable is what is passed around as variables in the Svelte components
  let conf:EntityConfigSetting|EntityConfigSetting[]

  // For Arrays, we leave them exactly as is, as these will be handled by the nested element
  if (Array.isArray(value)) conf = value
  // For strings, we make an EntityConfigSetting object
  else if (typeof value === 'string') conf = { [entityTypeFieldID]:value }
  // For EntityConfigSetting object, we clone it
  else if (value) conf = cloneDeep(value)
  // For other (e.g. undefined) values, we create an EntityConfigSetting object
  else conf = { [entityTypeFieldID]:field?.default }

  // Type options
  let typeOptions = cms.listEntities(opts.entityType, false, opts.fieldType) // TODO: ensure no circular dependencies are choices

  // initialize event dispatcher
  const dispatch = createEventDispatcher()

  // initialize var for the modal
  let modalOpen = false

  // Initialize vars for entity and inherited config
  let defaults:ConfigSetting, widgetFieldGroup:WidgetFieldFieldgroup, displayDefaults:FullEntityDisplayConfig

  // Whenever the type changes, set the entity, inherited config, and value
  function setType() {
    if (!Array.isArray(conf)) {
      let type = conf[entityTypeFieldID]?.toString()
      parentEntity = cms.getEntity(entityType.id, type)

      // get the defaults
      if (opts.isTopLevelEntity && entityID === type) { // The entity being configured is a top-level entity like cms.fields
        defaults = cms.getEntityConfig(opts.entityType, entityID, true)
      }
      else defaults = cms.getEntityConfig(opts.entityType, type)

      if (entityType.isDisplayable) displayDefaults = cms.getFullEntityDisplayConfig(entityType.id, parentEntity)

      widgetFieldGroup = cms.getWidgetFields(cms.getEntityConfigFieldgroup(opts.entityType, type), { values:conf, errors:{}, touched:{}, path:id })
    }
    setValue()
  }
  setType()

  // Whenever configuration changes, set the value
  function setValue(skipClose?:any) {

    let newValue
    if (Array.isArray(conf)) {
      newValue = conf.filter(Boolean)
    }

    else {

      // Get any customized values
      let customizations = Object.entries(conf || {}).filter(([k,v]) => {
        return !isEqual(defaults?.[k], v)
      })

      // Set the type field
      let typeField = isTyped ? [[ entityTypeFieldID, (typeof value === 'string' ? value : value?.[entityTypeFieldID]) ]] : []

      // Set the new value, including the type and the customized properties and options
      newValue = Object.fromEntries([...typeField, ...customizations.filter(c => typeof c[1] !== 'undefined')])

      // If the new value is only a type, it should be a string
      if ( isEqual(Object.keys(newValue), [entityTypeFieldID]) ) newValue = newValue[entityTypeFieldID]

    }
    // TODO: figure out how to remove the "type" field if this is a default entity type
    // Now set the value
    if (!isEqual(value,newValue)) value = newValue

    // And dispatch the change event
    dispatch('change', { value })

    // Close the Modal
    if (skipClose!=='skipClose') modalOpen = false

  }

  function addItem() {
    if (Array.isArray(conf)) conf = [...conf, {}]
  }

  function removeItem(i) {
    if (Array.isArray(conf)) {
      conf.splice(i,1)
      conf = conf
      setValue()
    }
  }

  // Reactive flag for whether the value is a simple string or a ConfigSetting object
  $: isString = typeof value === 'string'

  // Value for the form names
  $: formBaseID = entityID ? `${id}[${entityID}]` : id

  // Push upstream value reactively
  $: if (conf) setValue('skipClose')

  // Since this appears in listed fields in EntityLists, we have to update the 'conf' variable
  // when the value changes, or e.g. the slug won't change on the list of Content Types when
  // you set it in the Content Type detail.
  // @todo: this needs work and tests
  $: if ((value || !value) && !entityID && !Array.isArray(value)) setConf()
  function setConf() {
    if (Array.isArray(value)) {}
    else if (typeof value === 'string') {
      Object.keys(conf).forEach(k => { conf[k] = (k === entityTypeFieldID ? value : (parentEntity?.options?.[k] ?? parentEntity?.[k])) })
    }
    else {
      Object.keys(conf).forEach(k => conf[k] = value[k])
      if (value) {
        Object.keys(value).forEach(k => conf[k] = value[k])
      }
    }
  }

</script>

{#if isMultiple && Array.isArray(conf)}
  <!-- Entity accepts multiple values, as in preSave / preMount Transformers -->

  <fieldset class="multiple">
    <legend>{field?.label || entityType?.label || 'unknown entity'}</legend>
    {#each conf as value, i}
      <div class="multiple-item">
        <svelte:self
          nested
          {cms}
          {field}
          id={formBaseID[i]}
          bind:value={conf[i]}
          on:change={setValue}
        />
          <Button type=cancel small
            helptext="Remove {field.label} item"
            on:click={()=>{removeItem(i)}} />
      </div>
    {/each}
    <Button small on:click={addItem}>+ add {entityType?.label || 'unknown entity'}</Button>
  </fieldset>

{:else if !isNull(entityID)}
  <!-- Entity accepts an id / value pair, as in field lists -->

  <div class="field">
    <label>
      <span>ID</span>
      <input
        type="text"
        size=8
        bind:this={idElement}
        bind:value={entityID}
      >
    </label>
  </div>

  <div class="field ops">
    <Button type=configure small highlight on:click={()=>{modalOpen=true}} />
  </div>

  {#if entityType?.typeField}
    <div class="field config">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <span>{entityType.configFields?.[typeof entityType.typeField === 'string' ? entityType.typeField : 'type']?.label || 'Type'}</span>
        <CmsWidgetEntityTypeField
          {entityType}
          id="{isString ? formBaseID : `${formBaseID}[type]`}"
          bind:value={conf[entityTypeFieldID]}
          items={typeOptions}
          on:change={setType}
        />
      </label>
    </div>
  {/if}

  {#each (entityType?.listFields || []) as fieldID}
    {#if widgetFieldGroup?.fields?.[fieldID]}
      <CmsField
        class="config"
        field={widgetFieldGroup.fields[fieldID]}
        id="{formBaseID}[{fieldID}]"
        {cms}
        bind:value={conf[fieldID]}
      />
    {/if}
  {/each}

  {#if entityType.isDisplayable}
    <CmsWidgetDisplayList
      {cms}
      id="{formBaseID}[displays]"
      bind:value={conf['displays']}
      options={{displayDefaults}}
    />
  {/if}

  <div class="field ops">
    <slot></slot>
  </div>

{:else}
  <!-- Entity accepts a single value, as in a widget field -->
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label>
    {#if !nested}
      <span>{label || field?.label || entityType?.label || 'unknown entity'}</span>
    {/if}

    {#if entityType?.typeField}
      <CmsWidgetEntityTypeField
        {entityType}
        id="{isString ? formBaseID : `${formBaseID}[type]`}"
        bind:value={conf[entityTypeFieldID]}
        items={typeOptions}
        on:change={setType}
        required={field?.required ?? false}
        placeholder={opts.placeholder ?? ''}
      />
    {/if}

    {#if entityType.configFields || entityType.isConfigurable}
      <div class="details">
        {#if Object.keys(widgetFieldGroup?.fields || {}).length}
          <Button type=configure
            small
            on:click={()=>{modalOpen=true}}
            disabled={!conf[entityTypeFieldID]}
            highlight={conf[entityTypeFieldID] && typeof value !== 'string'}
            helptext={JSON.stringify(conf,null,2)}
          />
        {/if}
      </div>
    {/if}

  </label>
{/if}

{#if modalOpen}
  <Modal on:cancel={setValue}>
    <h2 slot="title">Configure {entityType.label} "{entityID ?? value?.[entityTypeFieldID] ?? value}"</h2>
    <form on:submit|preventDefault={setValue}>
      <CmsFieldGroup {cms} {widgetFieldGroup} bind:values={conf} />
    </form>
    <Button primary on:click={setValue}>Close</Button>
  </Modal>
{/if}

<style>
  div.details {
    width: 36px;
    height: 30px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
</style>