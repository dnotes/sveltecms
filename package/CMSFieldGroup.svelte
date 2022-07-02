<script>import CmsField from 'sveltecms/CMSField.svelte';
import { onMount, onDestroy, createEventDispatcher } from 'svelte';
export let cms;
export let values = {};
export let errors = {};
export let touched = {};
export let id = undefined;
let dispatch = createEventDispatcher();
// One of the below is required; widgetFieldGroup overrides fieldgroup
export let fieldgroup = undefined;
export let widgetFieldGroup = cms.getWidgetFields(fieldgroup, { values, errors, touched, id });
let root;
onMount(() => {
    widgetFieldGroup.eventListeners?.forEach(conf => {
        root.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.addEventListener(conf.on, (event) => {
            // TODO: Why are event and el not available when the function is executed?
            conf.function.fn(conf.function.vars, conf.function.options, event, el);
        }));
    });
});
onDestroy(() => {
    widgetFieldGroup.eventListeners?.forEach(conf => {
        root?.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.removeEventListener(conf.on, (event) => {
            conf.function.fn(conf.function.vars, conf.function.options, event, el);
        }));
    });
});
// This is necessary for conditional/computed fields
$: if (values || errors || touched)
    widgetFieldGroup = widgetFieldGroup;
$: if (values)
    dispatch('change', { values });
</script>

<div bind:this={root}>
  {#each Object.keys(values) as id}
    {#if !widgetFieldGroup.fields[id]}
      <input type="hidden" name={id} bind:value={values[id]} />
    {/if}
  {/each}
  {#each Object.entries(widgetFieldGroup.fields) as [id,field]}
    <CmsField {field} {id} bind:value={values[id]} {cms} />
  {:else}
    There are no fields to edit.
  {/each}
</div>
