<script lang="ts">

  export let item:string|number|{
    quote:string
    cite:string
  }
  let isQuoteBlock = item.hasOwnProperty('quote')

</script>

{#if isQuoteBlock}
  <blockquote cite="{item?.['cite'] || ''}">{@html item['quote']}</blockquote>
{:else}
  <blockquote>{item}</blockquote>
{/if}