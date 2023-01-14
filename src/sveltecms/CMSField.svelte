<script lang="ts">
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetFieldgroup from './widgets/CMSWidgetFieldgroup.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import ScriptableButton from 'sveltecms/widgets/ScriptableButton.svelte';
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms';

export let cms:SvelteCMS
export let id:string
export let field:WidgetField
export let value
let cls:string = ""
export { cls as class }

</script>

{#if !field.hidden}
  <div class="field field-{id} field-type-{field.type} widget-type-{field.widget.type} {cls} {field?.class || ''}">
    {#if !field?.widget?.widget}
      <CmsWidgetUndefined {field} {id} />
    {:else if field.multiple && !field.widget.handlesMultiple}
      <CmsWidgetMultiple
        {field}
        {id}
        bind:value
        {cms}
      />
    {:else if field.widget.type === 'fieldgroup'}
      <CmsWidgetFieldgroup
        {field}
        {id}
        bind:value
        {cms}
      />
    {:else if field.scriptable}
      <ScriptableButton
        {field}
        {id}
        {cms}
        bind:value
      />
    {:else}
      <svelte:component
        this={field.widget.widget}
        {field}
        {id}
        {cms}
        bind:value
      />
    {/if}
    {#if field.helptext}
      <div class="cms-helptext">{field.helptext}</div>
    {/if}
  </div>
{/if}
