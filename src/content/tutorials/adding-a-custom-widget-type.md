---
title: Adding a Custom Widget Type
tags:
  - title: Developers
    _slug: developers
    _type: tags
_slug: adding-a-custom-widget-type
_oldSlug: adding-a-custom-widget-type
_type: tutorials
---
Registering a custom Widget with SvelteCMS requires creating a plugin and an associated Svelte component. The `sveltecms/plugins/checkboxes` plugin has been created as an example.

## Plugin

The plugin should include the `widgetTypes` key, with an array of WidgetType objects.

### Example: `sveltecms/plugins/checkboxes/index.ts`

```ts
import type { CMSPlugin } from "sveltecms";
import CheckboxText from "./CheckboxText.svelte";

export const plugin:CMSPlugin = {
  id: 'checkboxes',
  widgetTypes: [
    {
      id: 'checkbox-text',
      description: 'Replaces the standard HTML checkbox input with a text-based input that should scale.',
      widget: CheckboxText,
      fieldTypes: ['boolean'],
      optionFields: {
        falseText: {
          type: 'text',
          size: '1',
          default: '☐',
          helptext: 'Character to show when the checkbox is not checked.',
        },
        trueText: {
          type: 'text',
          size: '1',
          default: '☑︎',
          helptext: 'Character to show when the checkbox is not checked.',
        },
        fontSize: {
          type: 'number',
          default: 150,
          helptext: 'The relative size of the checkbox text, as a percentage.',
          widget: {
            type: 'number',
            options: {
              min: 10,
              max: 500,
              step: 5,
            }
          }
        },
        labelBeforeCheckbox: {
          type: 'boolean',
          default: false,
          helptext: 'Render the text label before the checkbox element in HTML markup.',
        },
      }
    }
  ]
}

export default plugin
```

## Svelte Component

### Script

The Svelte component used for the Widget will receive the following properties when it is used:

* `cms`: The full SvelteCMS instance. Rarely needed for custom Widgets.
* `field`: The Field object. Necessary for:
  * `disabled` and `required` attributes of the visible input
  * the `<label>` for the form element
* `id`: The ID string of the element. Necessary for: 
  * the `name` attribute of whatever input is bound to the `value`
* `value`: The value of the field, which is passed to SvelteCMS as a bound property, i.e. with `bind:value`. 
  * The `value` must be bound with `bind:value` to an actual element, even if it is only `<input type="hidden" name="{id}">`, or form entry will be broken if submitted to an endpoint.

If your widget has options defined with the `optionFields` property on the WidgetType definition in the plugin, then you can use them in your Svelte component:

`let opts:{property:string} = field.widget.options`

### HTML

The minimum HTML for a Widget should include an HTML `input` within a `label`, with the field's actual label rendered in a `<span>`.
The `field.required` and `field.disabled` properties must be implemented, and the exported `value` and `id` variables must be bound to an input.

```
<label>
  <span>{field.label}</span>
  <input
    name="{id}"
    bind:value
    required={field.required}
    disabled={field.disabled}
  >
</label>
```

### Example: `sveltecms/plugins/checkboxes/CheckboxText.ts`

```svelte
<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    falseText?:string
    trueText?:string
    fontSize?:number
    labelBeforeCheckbox?:boolean
  } = field.widget.options

  function toggle() { if (!field.disabled) value = !value }

</script>

<label>
  <input
    type="hidden"
    name={id}
    bind:value
    required={field.required}
  >
  {#if opts?.labelBeforeCheckbox}
    <span on:click={toggle}>{field.label}</span>
  {/if}
  <i style:font-size="{opts?.fontSize ?? 100}%" on:click={toggle}>
    {#if value}
      {opts?.trueText || ''}
    {:else}
      {opts?.falseText || ''}
    {/if}
  </i>
  {#if !opts?.labelBeforeCheckbox}
    <span on:click={toggle}>{field.label}</span>
  {/if}
</label>

<style>
  i { display:inline-block; font-style:normal; line-height:inherit; }
</style>
```