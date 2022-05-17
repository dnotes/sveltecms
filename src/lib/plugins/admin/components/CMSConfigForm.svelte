<script lang="ts">
import type SvelteCMS from "sveltecms";
import { get, set, isEqual } from 'lodash-es'

  export let cms:SvelteCMS
  export let adminPath:string
  export let options:{
    component:string
    configPath?:string,
  }
  let opts = Object.assign({}, options)
  let component = cms.getEntity('components', opts.component)
  let configPath = options.configPath || adminPath.replace(/\/.+/,'')
  let data = cms.conf[configPath]

  // Variables for diffing
  $: oldConf = get(cms.conf, options.configPath, {})
  $: unsaved = !isEqual(oldConf, data) || !isEqual(Object.keys(oldConf), Object.keys(data))

  $: console.log(data)

  export let saveConfig = async () => {
    set(cms.conf, configPath, data)
    let res = await fetch('/admin/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cms.conf),
    })
    console.log(res)
  }

</script>

<form method="dialog" on:submit|preventDefault={saveConfig}>
  <svelte:component {cms} bind:data this={component.component} options={component.options}/>
  <button type="submit" disabled={!unsaved}>Save</button>
</form>