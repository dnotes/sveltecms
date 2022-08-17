<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms'
import CmsWidgetMultiple from 'sveltecms/widgets/CMSWidgetMultiple.svelte';

  export let cms:SvelteCMS
  export let field:WidgetField
  export let id:string
  export let value = Array.isArray(field.default) ? field.default : ( field.default ? [field.default] : [])

  $: widget = {
    ...cms.widgetTypes['text'],
    type:'text',
    handlesMultiple: false,
    handlesMedia: false,
    handlesFields: false,
    options:{ placeholder:`[value][:label], e.g. "apple" or "apple:Apple"` }
  }


</script>

<CmsWidgetMultiple {cms} {id} field={{...field, isFieldable:false, widget}} bind:value />
