<script>import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import { cloneDeep, get, intersection } from 'lodash-es';
import splitTags from '../utils/splitTags';
import Button from '../ui/Button.svelte';
const split = splitTags();
let parentField;
let parentID = '';
export { parentField as field, parentID as id };
export let cms;
export let value = {};
export let collapsed = undefined;
let w;
let minWidth = 0;
$: if (parentField?.widget?.options?.oneline)
    minWidth = Object.keys(parentField.fields || {}).reduce(getWidths, 0);
function getWidths(num, id) {
    return num + (parentField.fields[id].type === 'boolean' ? 40 : 80);
}
let opts = Object.assign({
    useComponents: false,
    fieldgroups: [],
    fieldgroupTags: [],
    oneline: false,
}, parentField.widget.options);
if (!Array.isArray(opts.fieldgroupTags))
    opts.fieldgroupTags = opts.fieldgroupTags.split(/[\s,]+/);
let parentFieldProxy = cloneDeep(parentField);
let fieldgroup;
let unrestricted = !opts?.fieldgroups?.length && !opts?.fieldgroupTags?.length;
let label = parentField.label;
$: if (parentField.multipleLabelFields?.['length'] && value)
    label = Array.isArray(parentField.multipleLabelFields) ?
        parentField.multipleLabelFields.map(s => s?.toString()) :
        split(parentField?.multipleLabelFields?.toString()).map(id => get(value, id) ?? id).join(', ');
$: fieldgroupItems = unrestricted ? Object.entries(cms.fieldgroups) : Object.entries(cms.fieldgroups)
    .filter(([id, fieldgroup]) => {
    return (opts?.fieldgroups ?? []).includes(id) || intersection((opts?.fieldgroupTags || []), fieldgroup.tags).length;
});
$: selectedFields = value?.['_fieldgroup'] ?
    (cms.fieldgroups?.[value['_fieldgroup']]?.fields || {}) :
    {};
$: if (selectedFields)
    parentFieldProxy.fields = Object.assign({}, parentField.fields || {}, selectedFields || {});
$: if (parentFieldProxy.fields || parentField.values || parentField.errors || parentField.touched)
    fieldgroup = cms.getWidgetFields(parentFieldProxy, {
        values: parentField.values,
        errors: parentField.errors,
        touched: parentField.touched,
        path: parentID
    });
</script>

<fieldset class="fieldgroup" class:oneline={opts?.oneline && w >= minWidth} class:collapsed bind:clientWidth={w}>

  <legend><Button highlight on:click={()=>{collapsed=!collapsed}}>{label}</Button></legend>

  {#if opts.useComponents}
    <label class="fieldgroup-choice">
      Fieldgroup:
      <select
        name="{parentID}._fieldgroup"
        bind:value={value['_fieldgroup']}
      >
        {#each fieldgroupItems as [id,fieldgroup]}
          <option value="{id}">{id}</option>
        {/each}
      </select>
    </label>
  {/if}

  {#each Object.entries(fieldgroup?.fields || {}) as [id, field] }

  <div class="field field-{field.id} field-type-{field.type} widget-type-{field.widget.type} {field?.class || ''}">
    {#if !field.hidden}
      {#if !field.widget.widget}
        <CmsWidgetUndefined {field} id="{parentID}.{id}" />
      {:else if field.multiple && !field.widget.handlesMultiple}
        <CmsWidgetMultiple
          {field}
          id="{parentID}[{id}]"
          bind:value={value[id]}
          {cms}
        />
      {:else if field.widget.type === 'fieldgroup'}
        <svelte:self
          {field}
          id="{parentID}[{id}]"
          bind:value={value[id]}
          {cms}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          {cms}
          id="{parentID}[{id}]"
          bind:value={value[id]}
        />
      {/if}
      {#if field.helptext}
        <p class="cms-helptext">{field.helptext}</p>
      {/if}
    {/if}
  </div>

  {/each}

</fieldset>

<style>

  .oneline {
    display: flex;
    flex-wrap: wrap;
  }
  .oneline :global(div.field) {
    flex-grow:1;
    width:5%;
  }

  legend {
    background: var(--cms-main);
  }
  .fieldgroup-choice {
    background: var(--cms-main);
    color: var(--cms-bg);
  }
  .fieldgroup {
    background: var(--cms-main);
  }
  .fieldgroup .field {
    background: var(--cms-bg);
  }
  .sveltecms fieldset.fieldgroup.collapsed {
    background: transparent;
    border-top: 3px solid var(--cms-main);
  }
  .sveltecms fieldset.fieldgroup.collapsed>div>.field,
  .sveltecms fieldset.fieldgroup.collapsed>.fieldgroup-choice {
    display: none;
  }</style>