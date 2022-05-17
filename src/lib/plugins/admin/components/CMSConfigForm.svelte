<script lang="ts">
import type SvelteCMS from "sveltecms";
import { get, set, isEqual } from 'lodash-es'

  export let cms:SvelteCMS
  export let data:string
  export let adminPath:string
  export let options:{
    component:string
    configPath?:string,
  }
  let opts = Object.assign({}, options)
  let component = cms.getEntity('components', opts.component)
  let configPath = data ?? options.configPath ?? adminPath.replace(/\//,'.')
  let conf = get(cms.conf, configPath, {})

  // Variables for diffing
  $: oldConf = get(cms.conf, configPath, {})
  $: unsaved = !isEqual(oldConf, conf) || !isEqual(Object.keys(oldConf), Object.keys(conf))

  export let saveConfig = async () => {
    set(cms.conf, configPath, conf)
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
  <svelte:component {cms} bind:data={conf} this={component.component} options={component.options}/>
  <button type="submit" disabled={!unsaved}>Save</button>
</form>