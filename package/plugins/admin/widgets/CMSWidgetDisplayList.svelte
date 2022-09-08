<script>import { cloneDeep, uniq } from "lodash-es";
import { isDisplayConfig, isDisplayNone } from "../../../core/Display";
import CmsWidgetEntity from "./CMSWidgetEntity.svelte";
export let cms;
export let field;
export let id;
export let value;
export let defaults;
$: displayDefaults = cms.parseEntityDisplayConfigSetting(defaults?.['displays']);
// The items should always be an array of [id, DisplayConfig]
let startConf = {
    ...Object.fromEntries(cms.displayModes.map(k => [k, ''])),
    ...parseEntityDisplayConfigSetting(value)
};
let items = Object.entries(startConf).map(([k, v]) => {
    let conf = isDisplayConfig(v) ? v : { type: v ?? '' };
    return [k, conf];
});
/**
 * Normalize the EntityDisplayConfigSetting into an object with any necessary display modes.
 * @param {string|false|undefined|DisplayConfigSetting|{[id:string]:DisplayConfigSetting}} conf
 *  The contents of the "displays" prop for a configurable object.
 * @returns {EntityDisplayConfig}
 * | Value type                         | Returns |
 * | -----                              | ------- |
 * | undefined                          | {}      |
 * | string                             | { [(...cms.displayModes):string]:value } |
 * | boolean                            | { [(...cms.displayModes):string]:value } |
 * | {type:any,[id:string]:any}         | { [(...cms.displayModes):string]:value } |
 * | {[id:string]:DisplayConfigSetting} | value |
 */
function parseEntityDisplayConfigSetting(value) {
    // If the conf is undefined, it shouldn't change other configurations
    if (typeof value === 'undefined')
        return {};
    // @ts-ignore Edge case for manual config where someone types "displays: false"
    if (typeof value === 'boolean')
        return Object.fromEntries(this.displayModes.map(m => [m, value.toString()]));
    // If the conf is a single display mode, it covers ALL display modes.
    // @ts-ignore for some reason, the boolean check above causes typescript to complain about this, but I think it's right
    if (typeof value === 'string' || isDisplayConfig(value))
        return { default: value };
    // Otherwise the config is already an EntityDisplayConfig
    return value;
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
function dumpEntityDisplayConfigSetting(items) {
    // let parsed = items.map(c => {
    //   return [c[0], (JSON.stringify(c[1]) === `{type:${c[1]?.['type']}}`)] ? c[1]['type'] : c[1]
    // })
    // If all display modes are the same (and we know we have them all)...
    let uniqueValues = uniq(items.map(c => {
        if (typeof (c?.[1]?.['type'] ?? c[1]) === 'undefined' || (c?.[1]?.['type'] ?? c[1]) === '')
            return; // lines 1 and 2
        if (isDisplayNone(c[1]))
            return 'none'; // line 3
        return c[1]; // line 4
    }));
    if (uniqueValues.length === 1)
        return uniqueValues[0];
    return Object.fromEntries(items.map(c => {
        return [c[0], c[1] === '' ? undefined : c[1]];
    }));
}
// Now transform the items back.
$: if (items)
    value = dumpEntityDisplayConfigSetting(items);
// $: console.log(displayDefaults) // TODO: get this to display the correct defaults for ContentTypes, Fields, and Fieldgroups
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
        placeholder:(
          displayDefaults?.['mode']?.['type'] ??
          displayDefaults?.['mode'] ??
          displayDefaults?.['default']?.['type'] ??
          displayDefaults?.['default'] ??
          ''
        )
      }}
      bind:value={display}
    />
  </div>
{/each}
