<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { ConfigSetting, EntityConfigSetting, WidgetField, WidgetFieldFieldgroup } from "sveltecms";

import { cloneDeep, isEqual, isNull } from "lodash-es";
import { createEventDispatcher } from "svelte";
import CmsFieldGroup from "sveltecms/CMSFieldGroup.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";

import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";

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
  } = field?.widget?.options || {}
  let opts = Object.assign({}, options)

  // This widget is used in two circumstances: as one property of a config setting, or as part of a list.
  // As a property of a config setting, e.g. a property of a FieldConfigSetting, it would NOT have an entityID, only a value.
  // As part of a list, e.g. when specifying fields for a ContentType, it would have both an entityID and a value.
  export let entityID:string|null = null

  // In a list, this item may be collapsed
  export let collapsed = false

  // Whether this is a nested EntityWidget, within an Entity field that handles multiple entries
  export let nested:boolean = false

  // The ID element, for focus operations
  export let idElement:HTMLElement = undefined

  // The entity type template. See EntityTemplate.ts
  let entityType = cms.getEntityType(opts.entityType)

  // Whether the entity has a type field
  let isTyped = entityType.typeField ? true : false

  // Whether the entity is multiple
  let isMultiple = field?.multiple

  // The main "type" field for the entityType -- usually "type", but may be another field
  // This is the field that will be populated if a configuration value is a string
  let entityTypeFieldID = typeof entityType?.typeField === 'string' ? entityType.typeField : 'type'

  // The full config of the entity
  value = value ?? field?.default
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
  let defaults:ConfigSetting, widgetFieldGroup:WidgetFieldFieldgroup

  // Whenever the type changes, set the entity, inherited config, and value
  function setType() {
    if (!Array.isArray(conf)) {
      let type = conf[entityTypeFieldID]?.toString()
      defaults = (opts.isTopLevelEntity && (entityID === type))
        ? cms.getEntityConfig(opts.entityType, entityID, true)
        : cms.getEntityConfig(opts.entityType, type)
      widgetFieldGroup = cms.getWidgetFields(cms.getEntityConfigFieldgroup(opts.entityType, type), { values:conf, errors:{}, touched:{}, id })
    }
    setValue()
  }
  setType()

  // Whenever configuration changes, set the value
  function setValue() {

    let newValue

    if (Array.isArray(conf)) {

      newValue = conf.filter(Boolean)

    }

    else {

      // Get any customized values // TODO: test whether we need isEqual instead of !==
      let customizations = Object.entries(conf || {}).filter(([k,v]) => {
        return !isEqual(defaults?.[k], v)
      })

      // Set the type field
      let typeField = isTyped ? [[ entityTypeFieldID, (typeof value === 'string' ? value : value?.[entityTypeFieldID]) ]] : []

      // Set the new value, including the type and the customized properties and options
      newValue = Object.fromEntries([...typeField, ...customizations])

      // If the new value is only a type, it should be a string
      if ( isEqual(Object.keys(newValue), [entityTypeFieldID]) ) newValue = newValue[entityTypeFieldID]

    }
    // TODO: figure out how to remove the "type" field if this is a default entity type
    // Now set the value
    value = newValue

    // And dispatch the change event
    dispatch('change', { value })

    // Close the Modal
    modalOpen = false

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
        <div class="delete">
          <Button cancel
            helptext="Remove {field.label} item"
            on:click={()=>{removeItem(i)}}>&times;</Button>
        </div>
      </div>
    {/each}
    <Button small on:click={addItem}>+ add {entityType?.label || 'unknown entity'}</Button>
  </fieldset>

{:else if !isNull(entityID)}
  <!-- Entity accepts an id / value pair, as in field lists -->
  <fieldset class="fieldgroup" class:collapsed>
    <legend>
      <label><em>{entityType?.label || "unknown entity"} &nbsp;</em>
        <input
          type="text"
          size=8
          bind:this={idElement}
          bind:value={entityID}
        >
      </label>

      {#if entityType?.typeField}
        <CmsWidgetEntityTypeField
          {entityType}
          id="{isString ? formBaseID : `${formBaseID}[type]`}"
          bind:value={conf[entityTypeFieldID]}
          items={typeOptions}
          on:change={setType}
        />
      {/if}

      {#each (entityType?.listFields || []) as fieldID}
        {#if widgetFieldGroup?.fields?.[fieldID]}

          <svelte:component
            this={widgetFieldGroup.fields[fieldID].widget.widget}
            field={widgetFieldGroup.fields[fieldID]}
            {id}
            {cms}
            bind:value={conf[fieldID]}
          />

        {/if}
      {/each}

      <slot></slot>

    </legend>
    {#if widgetFieldGroup && !opts.skipDetail}
      <CmsFieldGroup {cms} {widgetFieldGroup} bind:values={conf} on:change={setValue} />
    {/if}
  </fieldset>
{:else}
  <!-- Entity accepts a single value, as in a widget field -->
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label>
    {#if !nested}
      <span>{field?.label || entityType?.label || 'unknown entity'}</span>
    {/if}

    {#if entityType?.typeField}
      <CmsWidgetEntityTypeField
        {entityType}
        id="{isString ? formBaseID : `${formBaseID}[type]`}"
        bind:value={conf[entityTypeFieldID]}
        items={typeOptions}
        on:change={setType}
        required={field?.required ?? false}
      />
    {/if}

    {#if Object.keys(widgetFieldGroup?.fields || {}).length}
      <Button small highlight on:click={()=>{modalOpen=true}}>...</Button>
    {/if}

  </label>
{/if}

{#if modalOpen}
  <Modal on:cancel={setValue}>
    <h2>Configure {opts.entityType} {value?.[entityTypeFieldID] ?? value}</h2>
    <form on:submit|preventDefault={setValue}>
      <CmsFieldGroup {cms} {widgetFieldGroup} bind:values={conf} />
    </form>
    <Button primary on:click={setValue}>Close</Button>
  </Modal>
{/if}
