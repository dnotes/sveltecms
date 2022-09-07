<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { ConfigSetting } from 'sveltecms';
import CmsFieldGroup from 'sveltecms/CMSFieldGroup.svelte';

  export let cms:SvelteCMS
  export let data:{[id:string]:string|ConfigSetting}
  export let options:{
    configType:string
    configPath:string
  }
  $: opts = Object.assign({}, options)
  $: entityType = cms.getEntityType(opts.configType)
  $: widgetFieldGroup = cms.getWidgetFields(cms.getEntityConfigFieldgroup(entityType.id), {values:data, errors:{}, touched:{}, id:options.configPath})

</script>

<CmsFieldGroup {cms} {widgetFieldGroup} bind:values={data} />
