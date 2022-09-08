<script lang="ts">
  export let showHeadings:boolean = true
  export let headings:string[]
  export let items:{ [k:string]:any }[] = []
</script>

{#if showHeadings}
  <div class="flex font-bold opacity-50">
    {#each (headings || []) as heading}
      <div>
        {heading}
      </div>
    {/each}
  </div>
{/if}
{#each (items || []) as item}
  <div class="flex">
    {#each headings as h}
      <div>
        {item[h]}
      </div>
    {/each}
  </div>
{/each}

<style lang="postcss">
  div.flex div {
    @apply w-20 flex-shrink-0 text-center;
  }
  div.flex div:first-child {
    @apply w-40 font-bold text-left;
  }
  div.flex div:last-child {
    @apply w-96 flex-grow text-left;
  }
  div.flex.opacity-50 div:last-child {
    @apply hidden md:block;
  }
</style>