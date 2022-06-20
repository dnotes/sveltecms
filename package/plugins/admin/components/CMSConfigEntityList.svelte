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
// All config items for the type of entities being configured, as an array
let items = Object.entries(data);
// All entities of the type being configured
let entities = cms.listEntities(opts.configPath);
// A list of items that are not configured at all
$: defaultItems = entities.filter(id => !items.find(item => item[0] === id)).map(k => [k, undefined]);
function customizeDefaultItem(id, value) {
    if (value)
        items = [...items, [id, value]];
}
</script>

<CmsWidgetEntityList {cms} id="{opts.configType}" bind:value={data} options={{entityType:opts.configType}} />

{#if defaultItems.length}
  <h3>Default items:</h3>
  {#each defaultItems as [id, value]}
  <div class="field">
    <label for="{typeof value === 'string' ? id : id = '[type]'}"><span>{id}</span></label>
      <CmsWidgetEntity
        bind:value
        {cms}
        {id}
        options={{ entityType:opts.configType }}
        on:change={(e)=>{customizeDefaultItem(id,e?.detail?.value)}}
      />
    </div>
  {/each}
{/if}

<style>
</style>