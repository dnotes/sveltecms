<script lang="ts">
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetFieldgroup from './widgets/CMSWidgetFieldgroup.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms';

export let cms:SvelteCMS
export let id:string
export let field:WidgetField
export let value

</script>

{#if !field.hidden}
  <div class="field field-{id} {field?.class || ''}">
    {#if !field.widget.widget}
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
    {:else}
      <svelte:component
        this={field.widget.widget}
        {field}
        {id}
        bind:value
      />
    {/if}
    {#if field.helptext}
      <div class="cms-helptext">{field.helptext}</div>
    {/if}
  </div>
{/if}
