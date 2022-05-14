<script lang="ts">
import type { ConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType } from "sveltecms";
import type SvelteCMS from "sveltecms";
import type { FieldConfigSetting } from "sveltecms/core/Field";

import CmsFieldCollection from "sveltecms/CMSFieldCollection.svelte";

  export let cms:SvelteCMS
  export let data:ConfigurableEntityConfigSetting

  export let options:{
    type:string
    id:string
  }

  let opts = Object.assign({}, options)

  // Get the exact Entity or EntityType, e.g. the "staticFiles" contentStore
  let entityType = <ConfigurableEntityType> cms[opts.type][opts.id] || cms[opts.type][data?.type] || {}

  // Get all the option fields and defaults for that EntityType
  let optionFields = entityType?.['optionFields'] || {}
  let optionFieldIDs = Object.keys(optionFields)
  let optionDefaults = cms.getConfigOptionsFromFields(optionFields)

  // Some fields will be conf that are NOT in the optionFields
  // These must be "value" fields, so that they don't get removed from conf
  let entityTypeFields = Object.fromEntries(Object.keys(data)
    .filter(id => !optionFieldIDs.includes(id))
    .map(id => ([id, {
      id,
      type: 'value',
      value: data[id],
    }]))
  )
  let entityTypeFieldIDs = Object.keys(entityTypeFields)

  // Get the collection for the entity type, or mock one up if there is none.
  let collection = cms.adminCollections[`entityType_${opts.type}`] || { id:'entityType', fields: <{[id:string]:FieldConfigSetting}> {
    ...entityTypeFields, // For id, type, and things like mediaStore.immediateUpload
    ...optionFields // for all options defined by the plugin
  } }

  $: data = data

</script>

{#if collection}
  <CmsFieldCollection {cms} {collection} bind:values={data} />
{/if}
