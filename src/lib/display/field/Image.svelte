<script lang="ts">
  export let item:string|{
    src:string,
    alt?:string,
    title?:string
  }
</script>

{#if (typeof item === 'string' && item) || item?.['src']}
  <img src={item?.['src'] ?? item} alt={item?.['alt'] ?? ''} title={item?.['title'] ?? ''} />
{/if}