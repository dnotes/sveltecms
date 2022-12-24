<script lang="ts">
  import cms from '$lib/cms'
  import Table from './_object-reference-table.svelte'
  let items = Object.keys(cms.entityTypes)
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
      else if (['widget', 'contentStore', 'mediaStore', 'transformer'].includes(id)) {
        let entityTypeID = id === 'widget' ? 'widgetType' : id
        item.detailHeading = id === 'widget' ? 'Widget Types' : entityType.labelPlural
        item.itemsHeadings = ["option", "type", "default", "script", "description"]
        item.detail = cms.listEntities((id === 'widget' ? 'widgetTypes' : id))
        .map(id => cms.getEntity(entityTypeID, id))
        .filter(entity => (!entity?._parent || entity?.id === entity?._parent?.id))
        .map(entity => {
          return {
            heading: entity.id,
            description: entity?.description ?? '',
            items: Object.entries(cms.getEntityConfigFields(id, entity.id)).map(([propID,field]) => {
              return {
                option: propID,
                type: field.type,
                default: JSON.stringify(field.default),
                script: (field.isScriptable ?? cms.getEntityType(id)?.isScriptable) ? 'yes' : '',
                description: field.helptext,
              }
            })
          }
        })
      }
      return item
    })
</script>

<ul class="prose dark:prose-invert max-w-full p-8">
  {#each items as item}
    <li>
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
    </li>
  {/each}
</ul>
