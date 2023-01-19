<script lang="ts">
import { cloneDeep, isEqual, uniq } from "lodash-es";

import type { ConfigSetting, WidgetField } from "sveltecms";
import type SvelteCMS from "sveltecms";
import { isDisplayConfig, isDisplayNone, type DisplayConfig, type DisplayConfigSetting, type EntityDisplayConfig, type EntityDisplayConfigSetting, type FullEntityDisplayConfig } from "sveltecms/core/Display";

import CmsWidgetEntity from "./CMSWidgetEntity.svelte";

  export let cms:SvelteCMS
  export let field:WidgetField = undefined
  export let id:string
  export let value:EntityDisplayConfigSetting

  export let options:{
    displayDefaults:FullEntityDisplayConfig,
    required?:boolean
  }

  let fallbacks = {
    default: typeof options.displayDefaults === 'string' ? displayConfigToText(options.displayDefaults) : displayConfigToText(options.displayDefaults?.default),
    page: displayConfigToText(options.displayDefaults?.page),
    teaser: displayConfigToText(options.displayDefaults?.teaser),
    reference: displayConfigToText(options.displayDefaults?.reference),
  }
  let conf = {
    default: typeof value === 'string' ? { type: value } : value?.['default'],
    page: value?.['page'],
    teaser: value?.['teaser'],
    reference: value?.['reference'],
  }

  // The items should always be an array of [id, DisplayConfig]
  let items:[string,DisplayConfig][] = Object.entries(conf).map(([k,v]) => {
    let conf = isDisplayConfig(v) ? v : { type: v ?? '' }
    return [k,conf]
  })

  let placeholders
  getPlaceholders()

  function getPlaceholders() {
    placeholders = Object.fromEntries(items.map(([mode, val]) => {
      if (typeof value === 'string') return [mode, displayConfigToText(value)]
      else if (value?.hasOwnProperty('default')) return [mode, displayConfigToText(value['default'])]
      return [mode, fallbacks[mode]]
    }))
  }

  function displayConfigToText(d:DisplayConfigSetting) {
    if (typeof d === 'undefined' || d === '') return ''
    let text = typeof d === 'string' ? d : d?.['type']
    // @ts-ignore ...it could happen
    if (typeof d === 'boolean') text = d.toString()
    if (typeof d !== 'string') {
      if (d.wrapper) text = displayConfigToText(d.wrapper) + ' > ' + text
      if (d.label) text += ' (label)'
      if (d.html) text += ' (html)'
      if (d.link) text += ' (link)'
    }
    return text
  }

  function valueShouldBeUndefined(val:DisplayConfigSetting):boolean {
    if ((typeof val === 'string' && !val) || val?.['type'] === '') return true
    return false
  }

  /**
   * Collapse an the EntityDisplayConfig object into a config setting.
   * @param {EntityDisplayConfig} conf
   *  The contents of the "displays" prop for a configurable object.
   * @returns {EntityDisplayConfigSetting}
   * | Value                          | Returns   | Detail |
   * | -----                          | -------   | ------ |
   * | { [id:string]:undefined }      | undefined | All displayModes are undefined    |
   * | { [id:string]:'' }             | undefined | All displayModes are empty string |
   * | { [id:string]:("none",false) } | "none"    | All displayModes are displayNone  |
   * | { [id:string]:someValue }      | someValue | All displayModes are the same     |
   * | { [id:string]:'' }             | {}        | Empty string values are removed   |
   * | { default:any, page:any, ... } | value     | displayModes are different        |
   */
  function dumpEntityDisplayConfigSetting(items:[id:string, value:DisplayConfigSetting][]):void|EntityDisplayConfigSetting {
    if (isEqual(items.map(v => valueShouldBeUndefined(v[1])), [true,true,true,true])) {
      value = undefined
    }
    else {
      let newValue = Object.fromEntries(items.filter(v => !valueShouldBeUndefined(v[1])))
      value = isEqual(Object.keys(newValue), ['default']) ? newValue.default : newValue
    }
  }

  // Now transform the items back.
  $: if (items) {
    dumpEntityDisplayConfigSetting(items)
    getPlaceholders()
  }

</script>

{#each items as [mode, display], i}
  <div class="field display">
    <CmsWidgetEntity
      {cms}
      {field}
      id="{id}[{mode}]"
      label="{mode}"
      options={{
        entityType:'display',
        placeholder:placeholders[mode]
      }}
      bind:value={display}
    />
  </div>
{/each}
