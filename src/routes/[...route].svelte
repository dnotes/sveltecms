<script lang="ts">
  export let content
</script>

{#await content}
  fetching content...
{:then content}
  {JSON.stringify(content)}
{:catch error}
  {JSON.stringify(error)}
{/await}