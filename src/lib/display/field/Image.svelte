<script lang="ts">
  export let value:string|{
    src:string,
    alt?:string,
    title?:string
  }
</script>

{#if (typeof value === 'string' && value) || value?.['src']}
  <img src={value?.['src'] ?? value} alt={value?.['alt'] ?? ''} title={value?.['title'] ?? ''} />
{/if}