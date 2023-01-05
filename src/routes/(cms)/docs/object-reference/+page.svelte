<script lang="ts">
  import SvelteCMS from 'sveltecms'
  import defaultContent from 'sveltecms/plugins/defaultContent'
  import markdown from 'sveltecms/plugins/markdown'
  import math from 'sveltecms/plugins/math'
  import checkboxes from 'sveltecms/plugins/checkboxes'

  import { getLabelFromID } from 'sveltecms/utils'

  import Table from './_object-reference-table.svelte'

  let allPlugins = {
    defaultContent,
    markdown:markdown(),
    math,
    checkboxes,
  }

  let enabledPlugins = [ 'markdown', 'defaultContent' ]

  let cms = new SvelteCMS({}, enabledPlugins.map(p => allPlugins[p]))

  function reset() {
    console.log(enabledPlugins)
    cms = new SvelteCMS({}, enabledPlugins.map(p => allPlugins[p]))
  }

  let items = []
  $: if (cms) items = Object.keys(cms.entityTypes)
    .sort()
    .map(id => {
      let entityType = cms.getEntityType(id)
      // @ts-ignore
      let item = {
        label: entityType.label,
        labelPlural: entityType.labelPlural,
        isConfigurable: entityType.isConfigurable,
        description: entityType.description,
        configFields: Object.entries(entityType?.configFields || {}).map(([id,field])=> {
          return {
            ...field,
            property: id,
            default: JSON.stringify(field.default),
            script: (field.scriptable) ? 'yes' : '',
            description: field.helptext
          }
        }),
        detailHeading: '',
        detail: [],
        itemsHeadings: [],
      }

      // Preparing detailed information
      if (id === 'field') {
        item.detailHeading = 'Field Types'
        item.itemsHeadings = ["type", "widgets"]
        item.detail = cms.listEntities('fieldTypes').map(id => {
          return {
            heading: '',
            items: [{
              type: id,
              widgets: cms.getFieldTypeWidgets(false, id).join(', ')
            }]
          }
        })
      }
      else if (id === 'contentType') {
        item.detailHeading = 'Content Types'
        item.itemsHeadings = ['id', 'fields']
        item.detail = cms.listEntities('contentTypes').map(id => {
          return {
            heading: '',
            items: [{
              id,
              fields: Object.keys(cms.contentTypes[id].fields).join(', ')
            }]
          }
        })
      }
      else if (['adminPage','component','hook'].includes(id)) {}
      else if (cms.listEntities((id === 'widget' ? 'widgetTypes' : id))?.length) {
        let entityTypeID = id === 'widget' ? 'widgetType' : id
        item.detailHeading = id === 'widget' ? 'Widget Types' : entityType.labelPlural
        item.itemsHeadings = ["option", "type", "default", "script", "description"]
        item.detail = cms.listEntities((id === 'widget' ? 'widgetTypes' : id))
        .map(id => cms.getEntity(entityTypeID, id))
        .filter(entity => entity && (!entity?._parent || entity?.id === entity?._parent?.id))
        .map(entity => {
          return {
            heading: entity.id,
            description: entity?.description ?? '',
            items: Object.entries(cms.getEntityConfigFields(id, entity.id)).map(([propID,field]) => {
              return {
                option: propID,
                type: field.type,
                default: JSON.stringify(field.default),
                script: field.scriptable ? 'yes' : '',
                description: field.helptext,
              }
            })
          }
        })
      }
      return item
    })
</script>

<div class="prose dark:prose-invert max-w-full px-8 mt-8">

<h1>SvelteCMS Object Reference</h1>

<div>
  <label>
    <h4>Enabled plugins:</h4>
    <input type="checkbox" disabled checked />
    <span>Static Files</span>
    {#each Object.keys(allPlugins) as id}
      <label>
        <input type="checkbox" value="{id}" bind:group={enabledPlugins} on:change={reset} />
        <span>{getLabelFromID(id)}</span>
      </label>
    {/each}
  </label>
</div>

{#if cms}
  {#each items as item}
    <div>
      <h2>{item.label}</h2>
      <p class="prose prose-lead">{item.description}</p>
      {#if item.configFields.length}
        <Table
          headings={['property', 'type', 'default', 'script', 'description']}
          items={item.configFields || []}
        />
      {:else}
        <p class="prose prose-lead">{item.labelPlural} do not have shared configurable properties{#if item.isConfigurable}, though individual {item.labelPlural} may have configurable options.{:else}.{/if}</p>
      {/if}
      {#if item?.detailHeading}
        <ul>
          <h3>{item.detailHeading}</h3>
          {#if !item?.detail?.[0]?.heading}
            <Table headings={item.itemsHeadings} />
          {/if}
          {#each item.detail as detailItem}
            <li>
              {#if detailItem.heading}
                <h3>{detailItem.heading}</h3>
                {#if detailItem.description}
                  <p>{detailItem.description}</p>
                {/if}
              {/if}
              {#if detailItem?.items?.length}
                <Table
                  showHeadings={detailItem.heading ? true : false}
                  headings={item.itemsHeadings}
                  items={detailItem.items}
                />
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
{/if}

</div>
