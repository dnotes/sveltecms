<script>import Button from 'sveltecms/ui/Button.svelte';
import Modal from 'sveltecms/ui/Modal.svelte';
import CmsWidgetEntity from 'sveltecms/plugins/admin/widgets/CMSWidgetEntity.svelte';
import { tick } from 'svelte';
import yaml from 'js-yaml';
import AddItemLine from 'sveltecms/ui/AddItemLine.svelte';
import CmsWidgetEntityList from '../widgets/CMSWidgetEntityList.svelte';
export let cms;
export let data;
export let options;
let opts = Object.assign({}, options);
let entityType = cms.getEntityType(opts.configType);
let addEntity;
// All entities of the type being configured
let entities = cms.listEntities(opts.configPath);
// All config items for the type of entities being configured, as an array
$: items = Object.entries(data);
// A list of items that are not configured at all
$: defaultItems = entities.filter(id => !items.find(item => item[0] === id));
</script>

<CmsWidgetEntityList
  {cms}
  id="{opts.configType}"
  bind:value={data}
  bind:addEntity
  options={{ entityType:entityType.id, isTopLevelEntity:true }}
/>

{#if defaultItems.length}
  <h3>Default {entityType.labelPlural}:</h3>
  <fieldset class="multiple">
    {#each defaultItems as id}
      <div class="multiple-item">
        {id} &nbsp; <Button small on:click={()=>{addEntity(id)}}>customize</Button>
      </div>
    {/each}
  </fieldset>
{/if}
