<script>import { get, set, isEqual } from 'lodash-es';
import Button from "../../../ui/Button.svelte";
export let cms;
export let data;
export let adminPath;
export let options;
let opts = Object.assign({}, options);
let component = cms.getEntity('components', opts.component);
opts.configPath = data ?? opts.configPath ?? adminPath.replace(/\//, '.');
if (!opts.configType)
    opts.configType = opts?.configPath?.replace(/\..+/, '');
let conf = get(cms.conf, opts.configPath, {});
let showConfig = true;
// Variables for diffing
let oldConf = Object.assign({}, get(cms.conf, opts.configPath, {}));
$: unsaved = !isEqual(oldConf, conf) || !isEqual(Object.keys(oldConf), Object.keys(conf));
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
<Button on:click={()=>{showConfig=!showConfig}}>{showConfig ? 'hide config' : 'show config'}</Button>
<div class="formContainer" class:showConfig>
  <form method="dialog" on:submit|preventDefault={saveConfig}>
    <svelte:component {cms} bind:data={conf} this={component.component} options={{...opts, ...component.options}} {adminPath} />
    <Button submit disabled={!unsaved}>Save</Button>
  </form>
  <div class="code" class:showConfig>
    <div class="codeCancel">
      <Button type=cancel on:click={()=>{showConfig=false}} />
    </div>
    <pre><code>{JSON.stringify(conf, null, 2)}</code></pre>
  </div>
</div>

<style>
  div.formContainer {
    width: calc(100vw - 40px);
    display: flex;
  }
  form {
    width:100%;
    flex-shrink:1;
    overflow-x:scroll;
  }
  div.code {
    overflow: scroll;
    height: calc(100vh - 150px);
    font-size: 12px;
    display: none;
    width: 400px;
    position: relative;
    z-index: 100;
  }
  div.code.showConfig {
    display:block;
  }
  div.codeCancel {
    position:absolute;
    top:0;
    right:0;
  }
  div.showConfig :global(.modalbg) {
    padding-right:320px;
  }</style>