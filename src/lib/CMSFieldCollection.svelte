<script lang="ts">
import CmsField from 'sveltecms/CMSField.svelte';
import type SvelteCMS from 'sveltecms';
import Collection, { type CollectionConfigSetting } from './core/Collection';

export let cms:SvelteCMS

export let values = {}
export let errors = {}
export let touched = {}

// One of the below is required; widgetFieldCollection overrides collection
export let collection:CollectionConfigSetting = undefined
export let widgetFieldCollection = cms.getWidgetFields(new Collection(collection, cms), {
  values, errors, touched, id:collection.id
})

</script>
{#each Object.keys(values) as id}
  {#if !widgetFieldCollection.fields[id]}
    <input type="hidden" name={id} bind:value={values[id]} />
  {/if}
{/each}
{#each Object.entries(widgetFieldCollection.fields) as [id,field]}
  <CmsField {field} {id} bind:value={values[id]} {cms} />
{:else}
  There are no fields to edit.
{/each}
