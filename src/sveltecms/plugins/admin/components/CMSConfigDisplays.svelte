<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { FullEntityDisplayConfig } from 'sveltecms/core/Display';
import CmsWidgetDisplayList from '../widgets/CMSWidgetDisplayList.svelte';

  export let cms:SvelteCMS
  export let data:{[id:string]:FullEntityDisplayConfig}

</script>

<div>
  {#each Object.keys(data || {}) as entityTypeID}
    <h3>{cms.getEntityType(entityTypeID).label}</h3>
    <CmsWidgetDisplayList
      id={entityTypeID}
      {cms}
      bind:value={data[entityTypeID]}
      options={{
        required: true,
        displayDefaults: data[entityTypeID]
      }}
    />
  {/each}
</div>

<style>
  div :global(>.field>label) {
    display:flex;
    align-items: center;
  }
  div :global(>.field>label>span:first-child) {
    display: block;
    width: 120px;
  }
  div :global(>.field>label>input) {
    flex-grow: 1;
    max-width: 960px;
  }
</style>