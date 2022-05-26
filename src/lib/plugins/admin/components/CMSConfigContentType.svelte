<script lang="ts">
import { set } from "lodash-es";

import type SvelteCMS from "sveltecms";
import type { ContentTypeConfigSetting } from "sveltecms/core/ContentType";

import CmsConfigFieldList from "sveltecms/plugins/admin/components/CMSConfigFieldList.svelte";
import CmsWidgetConfigurableEntity from 'sveltecms/plugins/admin/widgets/CMSWidgetConfigurableEntity.svelte'
import { getLabelFromID } from "sveltecms/utils";

  export let cms:SvelteCMS
  export let data:ContentTypeConfigSetting
  export let adminPath:string

  let contentTypeID = adminPath.replace(/.+\//, '')
  let contentStores = cms.listEntities('contentStores')
  let mediaStores = cms.listEntities('mediaStores')
  let contentTypes = cms.listEntities('types')
  let components = cms.listEntities('components')

  let defaultContentStore = (Object.keys(cms.contentStores || {}) || [])[0]
  let defaultMediaStore = (Object.keys(cms.mediaStores || {}) || [])[0]

  $: defaultLabel = getLabelFromID(contentTypeID)

  let formConfig:{method?:string,action?:string} = {}
  $: if (Object.values(formConfig).filter(Boolean).length) setProp('form', formConfig)

  function setProp(path:string, value) {
    set(data, path, value || undefined) // shorthand since there are no booleans
  }

</script>

<div class="field">
  <label>
    <span>Label</span>
    <input type="text" name='label' bind:value={data.label} placeholder={defaultLabel}>
  </label>
  <div class="cms-helptext">
    The title used for this content type in admin interfaces. Should be singular.
  </div>
</div>

<div class="field">
  <label>
    <span>Slug</span>
    <input type="text" name="slug" required bind:value={data.slug}>
  </label>
  <div class="cms-helptext">
    A comma-separated list of field IDs to use for the slug.
  </div>
</div>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="field"><label>
  <span>Content Store</span>
  <CmsWidgetConfigurableEntity
    {cms}
    type="contentStores"
    id="contentStore"
    items={contentStores}
    unset="- use default -"
    bind:value={data.contentStore} />
  </label>
  <div class="cms-helptext">
    The contentStore used for the content type. CMS default is currently "{defaultContentStore}".
  </div>
</div>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="field"><label>
  <span>Media Store</span>
  <CmsWidgetConfigurableEntity
    {cms}
    type="mediaStores"
    id="mediaStore"
    items={mediaStores}
    unset="- use default -"
    bind:value={data.mediaStore} />
  </label>
  <div class="cms-helptext">
    The mediaStore used for the content type. CMS default is currently "{defaultMediaStore}".
  </div>
</div>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="field"><label>
  <span>Display component</span>
  <CmsWidgetConfigurableEntity
    {cms}
    type="components"
    id="displayComponent"
    items={components}
    unset="- default -"
    bind:value={data.displayComponent} />
  </label>
  <div class="cms-helptext">
    The component used for displaying this type of content.
  </div>
</div>


<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="field"><label>
  <span>Preview component</span>
  <CmsWidgetConfigurableEntity
    {cms}
    type="components"
    id="previewComponent"
    items={components}
    unset="- default -"
    bind:value={data.previewComponent} />
  </label>
  <div class="cms-helptext">
    The component used for previewing content of this type during editing.
  </div>
</div>


<div class="field"><label>
  <span>Form Method</span>
  <select name="form[method]" bind:value={formConfig.method}>
    <option value="">Javascript (on client)</option>
    <option value="post">POST to server</option>
    <option value="get">GET to server</option>
  </select>
  <div class="cms-helptext">
    The method that the form uses when submitted.
  </div>
</label></div>

{#if formConfig.method}
  <div class="field">
    <label>
      <span>Form Action</span>
      <input type="text" on:change={(e)=>{setProp('form[action]', e.target?.['value'])}}>
    </label>
    <div class="cms-helptext">
      The url to which the form gets submitted. If blank, will submit to the same url as the form.
    </div>
  </div>
{/if}

<h3>Fields</h3>

<CmsConfigFieldList {cms} bind:data={data.fields} options={{ id:'fields' }} />