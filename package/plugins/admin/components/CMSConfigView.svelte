<script>import yaml from 'js-yaml';
import { onMount } from "svelte";
export let cms;
let format;
let content;
onMount(() => { format = cms?.admin?.contentStore?.options?.fileExtension?.toString() || 'json'; });
const encoders = {
    json: v => { return JSON.stringify(v, null, 2); },
    yaml: v => { return yaml.dump(v); },
    yml: v => { return yaml.dump(v); },
};
$: content = encoders?.[format] ? encoders[format](cms.conf) : '';
</script>

<div class="wrapper">
  <div style="user-select:none;">
    <a href="#json" on:click|preventDefault={()=>{format='json'}}>JSON</a>
    <a href="#yaml" on:click|preventDefault={()=>{format='yaml'}}>YAML</a>
  </div>
  <pre><code>{content}</code></pre>
</div>

<style>
  pre { padding:1em; }</style>
