<script>import { get, set, isEqual } from 'lodash-es';
import Button from "sveltecms/ui/Button.svelte";
import yaml from 'js-yaml';
export let cms;
export let data;
export let adminPath;
export let options;
let opts = Object.assign({}, options);
let component = cms.getEntity('components', opts.component);
opts.configPath = data ?? opts.configPath ?? adminPath.replace(/\//, '.');
if (!opts.configType)
    opts.configType = opts.configPath.replace(/\..+/, '');
let conf = get(cms.conf, opts.configPath, {});
// Variables for diffing
let oldConf = Object.assign({}, get(cms.conf, opts.configPath, {}));
$: unsaved = !isEqual(oldConf, conf) || !isEqual(Object.keys(oldConf), Object.keys(conf));
// Variable for seeing
$: code = yaml.dump(conf);
export let saveConfig = async () => {
    set(cms.conf, opts.configPath, conf);
    return fetch('/admin/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cms.conf),
    });
};
</script>
<form method="dialog" on:submit|preventDefault={saveConfig}>
  <svelte:component {cms} bind:data={conf} this={component.component} options={{...opts, ...component.options}} {adminPath} />
  <Button submit disabled={!unsaved}>Save</Button>
</form>
<div>
  <pre><code>{code}</code></pre>
</div>

<style>
  @media all and (min-width:800px) {
    form { width:70%; display:inline-block; vertical-align:top; }
    div { font-size: 12px; width: 28%; display:inline-block; overflow-x:scroll; }
  }</style>