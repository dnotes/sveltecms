<script>import { cloneDeep, isEqual, isNull } from "lodash-es";
import { createEventDispatcher } from "svelte";
import CmsFieldGroup from "sveltecms/CMSFieldGroup.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";
import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";
export let cms;
export let id;
export let value;
export let field = undefined;
// @ts-ignore
export let options = field?.widget?.options || {};
let opts = Object.assign({}, options);
// This widget is used in two circumstances: as one property of a config setting, or as part of a list.
// As a property of a config setting, e.g. a property of a FieldConfigSetting, it would NOT have an entityID, only a value.
// As part of a list, e.g. when specifying fields for a ContentType, it would have both an entityID and a value.
export let entityID = null;
// In a list, this item may be collapsed
export let collapsed = false;
// The entity type template. See EntityTemplate.ts
let entityType = cms.getEntityType(opts.entityType);
// The main "type" field for the entityType -- usually "type", but may be another field
// This is the field that will be populated if a configuration value is a string
let entityTypeFieldID = typeof entityType?.typeField === 'string' ? entityType.typeField : 'type';
// The full config of the entity
value = value ?? field?.default;
let conf = typeof value === 'string' ? { [entityTypeFieldID]: value } : (value ? cloneDeep(value) : { [entityTypeFieldID]: field?.default });
// Type options
let typeOptions = cms.listEntities(opts.entityType, false, opts.fieldType); // TODO: ensure no circular dependencies are choices
// initialize event dispatcher
const dispatch = createEventDispatcher();
// initialize var for the modal
let modalOpen = false;
// Initialize vars for entity and inherited config
let defaults, widgetFieldGroup;
// Whenever the type changes, set the entity, inherited config, and value
function setType() {
    let type = conf[entityTypeFieldID]?.toString();
    defaults = cms.getEntityConfig(opts.entityType, type);
    widgetFieldGroup = cms.getWidgetFields(cms.getEntityConfigFieldgroup(opts.entityType, type), { values: conf, errors: {}, touched: {}, id });
    setValue();
}
setType();
// Whenever configuration changes, set the value
function setValue() {
    // Get any customized values // TODO: test whether we need isEqual instead of !==
    let customizations = Object.entries(conf || {}).filter(([k, v]) => (defaults?.[k] !== v));
    // Set the new value, including the type and the customized properties and options
    let newValue = Object.fromEntries([[entityTypeFieldID, value?.[entityTypeFieldID] ?? value], ...customizations]);
    // If the new value is only a type, it should be a string
    if (isEqual(Object.keys(newValue), [entityTypeFieldID]))
        newValue = newValue[entityTypeFieldID];
    // TODO: figure out how to remove the "type" field if this is a default entity type
    // Now set the value
    value = newValue;
    // And dispatch the change event
    dispatch('change', { value });
    // Close the Modal
    modalOpen = false;
}
// Reactive flag for whether the value is a simple string or a ConfigSetting object
$: isString = typeof value === 'string';
// Value for the form names
$: formBaseID = entityID ? `${id}[${entityID}]` : id;
</script>

{#if !isNull(entityID)}
  <fieldset class="fieldgroup" class:collapsed>
    <legend>
      <label><em>{entityType?.label || "unknown entity"} &nbsp;</em>
        <input
          type="text"
          size=8
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

    </legend>
    {#if widgetFieldGroup}
      <CmsFieldGroup {cms} {widgetFieldGroup} bind:values={conf} />
    {/if}
  </fieldset>
{:else}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label><span>{field?.label || entityType?.label || 'unknown entity'}</span>

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
