<script>import yaml from 'js-yaml';
import { onMount } from "svelte";
import CmsFieldGroup from "../../../CMSFieldGroup.svelte";
import Field from '../../../core/Field';
import { cloneDeep } from "lodash-es";
import Modal from "../../../ui/Modal.svelte";
import Button from "../../../ui/Button.svelte";
export let cms;
export let data;
let format;
let content;
let settings = cloneDeep(data);
let open;
onMount(() => { format = cms?.admin?.contentStore?.options?.fileExtension?.toString() || 'json'; });
const encoders = {
    json: v => { return JSON.stringify(v, null, 2); },
    yaml: v => { return yaml.dump(v); },
    yml: v => { return yaml.dump(v); },
};
const fieldgroup = new Field('', {
    type: 'fieldgroup',
    fields: {
        buildAdmin: {
            type: 'boolean',
            default: false,
            helptext: 'Whether to include the Admin UI when building for production. '
                + 'If you are using this to build static sites, this should probably be unselected, '
                + 'in which case you must also set "config.kit.prerender.handleHttpError to "warn" '
                + 'or "ignore" in svelte.config.js.'
        },
        adminStore: {
            type: 'entity',
            default: '',
            helptext: 'The store used for CMS configuration. Defaults to staticFiles (with customizations).',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'contentStore',
                }
            }
        },
        indexer: {
            type: 'entity',
            default: '',
            helptext: 'The indexer used for creating all indexes of content.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'indexer',
                }
            }
        },
        rootContentType: {
            type: 'text',
            default: '',
            helptext: 'The content type used for top-level paths, e.g. "/about".',
            widget: {
                type: 'select',
                options: {
                    items: {
                        function: 'listEntities',
                        params: ['contentType'],
                    },
                    unset: '- none -',
                }
            }
        },
        frontPageSlug: {
            type: 'text',
            default: '',
            helptext: 'The slug for the front page. If provided, the content of ' +
                'the Root Content Type that has this slug will be the front page of the site/app.'
        },
    }
}, cms);
$: content = encoders?.[format] ? encoders[format](cms.conf) : '';
$: if (settings)
    data = Object.fromEntries(Object.entries(settings)
        .filter(([, val]) => Boolean(val)));
</script>

<CmsFieldGroup
  {cms}
  {fieldgroup}
  bind:values={settings}
  on:change={(e) => {
    if (typeof e.detail.values.adminStore !== 'string' && !e.detail.values.adminStore?.type) settings.adminStore = ''
    if (typeof e.detail.values.indexer !== 'string' && !e.detail.values.indexer?.type) settings.indexer = ''
  }}
/>

<Button on:click={()=>{open=!open}}>View full configuration</Button>

{#if open}
  <Modal on:cancel={()=>{open=false}}>
    <div style="position:absolute;right:1em;user-select:none;">
      <Button type=cancel on:click={()=>{open=false}} />
    </div>
    <div class="wrapper">
      <div style:user-select="none">
        <a href="#json" on:click|preventDefault={()=>{format='json'}}>JSON</a>
        <a href="#yaml" on:click|preventDefault={()=>{format='yaml'}}>YAML</a>
      </div>
      <pre><code>{content}</code></pre>
    </div>
  </Modal>
{/if}

<style>
  pre { padding:1em; }</style>
