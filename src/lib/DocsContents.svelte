<script lang="ts">
  // @ts-ignore ...it works?
  import docs from '/src/content/_docs.index.json'
  import { page } from '$app/stores'
</script>

<h2>Contents</h2>
<ul>
  {#each (docs || []) as item}
    <li><a class="text-black dark:text-stone-50 hover:text-cyan-600 font-roboto font-light text-lg" class:current={$page.url.pathname.replace(/.+\//, '').startsWith(item._slug)} href="/docs/{item._slug}">{item.title}</a></li>
  {/each}
</ul>
<hr class="my-7">
<a class="text-xl font-bold" href="/tutorials">Tutorials</a>

<style lang="postcss">
  a.current { @apply text-stone-500 dark:text-stone-400 }
</style>
