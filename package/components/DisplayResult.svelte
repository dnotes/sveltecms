<script>import { fade } from 'svelte/transition';
export let duration = 4000;
export let result = undefined;
export let fadeOptions = {};
$: if (result)
    setTimeout(() => { result = undefined; }, duration);
$: error = !result?.ok && !result?.success;
</script>

{#if result}
<div out:fade={fadeOptions} class="CMSSubmitResult {error ? "error" : "status"}">
  {#if error}
    <slot name="error">
      There was an error!<br>
      {result?.code} {result?.message}
    </slot>
  {:else}
    <slot>Success!</slot>
  {/if}
</div>
{/if}
