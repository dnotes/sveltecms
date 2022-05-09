<script lang="ts">
import CmsField from 'sveltecms/CMSField.svelte';
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms';
import type { ContentType } from 'sveltecms/core/ContentType'
import type { Field } from 'sveltecms/core/Field'

export let cms:SvelteCMS
export let value = {}

export let fieldableItem:ContentType|Field

let widgetFieldCollection = cms.getWidgetFields(fieldableItem, {
  values: fieldableItem.values,
  errors: fieldableItem.errors,
  touched: fieldableItem.touched,
  id: fieldableItem.id
})

</script>

{#each Object.entries(widgetFieldCollection.fields) as [id,field]}
  <CmsField {field} {id} bind:value={value[id]} {cms} />
{:else}
  There are no fields to edit.
{/each}
