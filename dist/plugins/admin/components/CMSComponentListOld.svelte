<script>import Button from "../../../ui/Button.svelte";
import Modal from "../../../ui/Modal.svelte";
import CmsConfigForm from "./CMSConfigForm.svelte";
export let cms;
export let data; // An array of all files in the $lib folder
export let adminPath;
// Find the path to the $lib folder in sveltekit/vite
let libPath = data.length <= 1 ? (data[0] ?? '').replace(/[^\/]+$/, '') : data.reduce((agg, v) => {
    let arr = [];
    let aggArr = agg.split('/');
    let vArr = v.split('/');
    for (let i = 0; i < aggArr.length; i++) {
        if (aggArr[i] === vArr[i])
            arr.push(aggArr[i]);
    }
    return arr.join('/') + '/';
}, data[0]);
let showLibPath;
// Prepare the data to save
let saveData = Object.fromEntries(data.map(f => ([f, cms?.components[f] ? true : false])));
$: if (libPath)
    data.forEach(f => { if (cms.components[relativePath(f).replace(/\W/g, '_')])
        saveData[f] = true; });
function relativePath(filepath) { return filepath.replace(libPath, '').replace(/\.svelte$/, ''); }
function toggleLibPath() { showLibPath = !showLibPath; }
export let save = async () => {
    return fetch('/admin/components', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(Object.entries(saveData).map(([filepath, value]) => ([relativePath(filepath), value])))),
    });
};
</script>

<h3>Available components in your $lib directory:</h3>

<p>
  SvelteCMS can use .svelte files in the $lib folder as the components for previewing and displaying content and fields.
  These files must be pre-loaded with SvelteCMS. You can select them here.
  Saving this page writes to <code>{cms.conf?.configPath}.components.ts.</code>
</p>

<em>$lib folder path: <Button small borderless href="#_" on:click={toggleLibPath}>{libPath}</Button></em>
{#if showLibPath}
  <Modal>
    <label>
      <input type="text" bind:value={libPath}>
      <p>
        If all of your .svelte components are in a subfolder in your $lib directory,
        then you may need to adjust the path mapping here.
      </p>
    </label>
    <Button on:click={toggleLibPath}>Close</Button>
  </Modal>
{/if}

<form method="post" enctype="multipart/form-data" on:submit|preventDefault={save}>
  <div class="field">
    {#each data as filepath}
      <div>
        <label>
          <input type="checkbox" value={relativePath(filepath)} bind:checked={saveData[filepath]}>
          $lib/{relativePath(filepath)}
        </label>
      </div>
    {:else}
      <p>You have no .svelte files in your $lib folder.</p>
    {/each}
  </div>
  <Button submit>Save</Button>
</form>

<h3>Configure components:</h3>

<CmsConfigForm {cms} data='components' {adminPath} options={{ component:'CMSConfigEntityList', }} />
