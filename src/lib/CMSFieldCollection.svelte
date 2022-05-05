<script lang="ts">
import CmsField from 'sveltecms/CMSField.svelte';
import type SvelteCMS from 'sveltecms';
import type { CMSContentType, CMSWidgetField } from 'sveltecms';

export let cms:SvelteCMS
export let fieldList:{[id:string]:CMSWidgetField}
export let values
export let contentType:string|CMSContentType

</script>

{#each Object.entries(fieldList) as [id,field]}
  <CmsField {field} {id} bind:value={values[id]} {cms} {contentType} />
{:else}
  There are no fields to edit.
{/each}
