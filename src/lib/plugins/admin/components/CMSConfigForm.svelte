<script lang="ts">
import type SvelteCMS from "sveltecms";
import { get, set, isEqual } from 'lodash-es'

  export let cms:SvelteCMS
  export let data:string
  export let adminPath:string
  export let options:{
    component:string
    type?:string,
    configPath?:string,
  }
  let opts = Object.assign({}, options)
  let component = cms.getEntity('components', opts.component)
  opts.configPath = data ?? opts.configPath ?? adminPath.replace(/\//,'.')
  if (!opts.type) opts.type = opts.configPath.replace(/\..+/, '')
  let conf = get(cms.conf, opts.configPath, {})

  // Variables for diffing
  $: oldConf = get(cms.conf, opts.configPath, {})
  $: unsaved = !isEqual(oldConf, conf) || !isEqual(Object.keys(oldConf), Object.keys(conf))

  export let saveConfig = async () => {
    set(cms.conf, opts.configPath, conf)
    return fetch('/admin/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cms.conf),
    })
  }

</script>

<form method="dialog" on:submit|preventDefault={saveConfig}>
  <svelte:component {cms} bind:data={conf} this={component.component} options={{...opts, ...component.options}}/>
  <button type="submit" disabled={!unsaved}>Save</button>
</form>