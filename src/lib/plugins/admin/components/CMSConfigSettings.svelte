<script lang="ts">
import type SvelteCMS from "sveltecms";
import yaml from 'js-yaml'
import { onMount } from "svelte";
import CmsFieldGroup from "sveltecms/CMSFieldGroup.svelte";
import type { ConfigSetting } from "sveltecms";
import Field from 'sveltecms/core/Field';
import { cloneDeep } from "lodash-es";
import Modal from "sveltecms/ui/Modal.svelte";
import Button from "sveltecms/ui/Button.svelte";

  export let cms:SvelteCMS
  export let data:ConfigSetting

  let format:string
  let content:string
  let settings = cloneDeep(data)
  let open

  onMount(() => { format = cms?.admin?.contentStore?.options?.fileExtension?.toString() || 'json' })

  const encoders = {
    json: v => {return JSON.stringify(v, null, 2)},
    yaml: v => {return yaml.dump(v)},
    yml: v => {return yaml.dump(v)},
  }

  const fieldgroup = new Field('', {
    type: 'fieldgroup',
    fields: {
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
        helptext: 'The slug for the front page. If provided, the content of '+
          'the Root Content Type that has this slug will be the front page of the site/app.'
      },
      defaultContentDisplay: {
        type: 'entity',
        default: 'div',
        helptext: 'The default display for all Content Types. Useful for things like TailwindCSS with Typography plugin, '+
          'e.g. "div.prose.dark:prose-invert".',
        widget: {
          type: 'entity',
          options: {
            entityType: 'display'
          }
        }
      },
      defaultContentDisplayModes: {
        type: 'entityList',
        default: {},
        helptext: 'The default display for all Content Types. Useful for things like TailwindCSS with Typography plugin, '+
          'e.g. "div.prose.dark:prose-invert".',
        widget: {
          type: 'entityList',
          options: {
            legend: 'Default Content Display Modes',
            entityType: 'display'
          }
        }
      },
    }
  }, cms)

  $: content = encoders?.[format] ? encoders[format](cms.conf) : ''

  $: if (settings) data = Object.fromEntries(
    Object.entries(settings)
    .filter(([,val])=>Boolean(val))
  )

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
      <Button cancel on:click={()=>{open=false}}>&times;</Button>
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
  pre { padding:1em; }
</style>
