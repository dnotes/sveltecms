<script lang="ts">
import type SvelteCMS from "sveltecms";
import Display from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";
import { browser } from '$app/env'

  export let cms:SvelteCMS
  export let entity:Field
  export let item:string|Date
  export let displayMode:string

  let lang = 'en-US'
  $: if (browser && window?.navigator?.language) lang = window.navigator.language
  $: realDate = typeof (item) === 'string' ? new Date(item) || item : item
  $: displayDate = realDate?.toLocaleString(lang) || 'no date'

  let display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'span', cms)

</script>

<svelte:element
  this={display.tag}
  id={display.id}
  class="{display.classList}"
>
  {displayDate}
</svelte:element>
