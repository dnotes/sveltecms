<script>import Display from "../../core/Display";
import { isBrowser } from 'browser-or-node';
export let cms;
export let entity;
export let item;
export let displayMode;
let lang = 'en-US';
$: if (isBrowser && window?.navigator?.language)
    lang = window.navigator.language;
$: realDate = typeof (item) === 'string' ? new Date(item) || item : item;
$: displayDate = realDate?.toLocaleString(lang) || 'no date';
let display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms);
</script>

<svelte:element
  this={display.tag}
  id={display.id}
  class="{display.classList}"
>
  {displayDate}
</svelte:element>
