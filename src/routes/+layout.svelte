<script>
  import "sveltecms/sveltecms-forms.css";
  import "../app.css";
  import { page } from '$app/stores'
  import DocsContents from "$lib/DocsContents.svelte";
</script>

<div id="page" class="flex flex-col min-h-screen w-screen">
  <header class="px-5 py-2 flex items-center bg-stone-50 dark:bg-stone-900 shadow-stone-400 dark:shadow-stone-900 shadow-sm sticky top-0 z-20">
    <div class="text-3xl sm:text-5xl flex-grow">
      <a href="/"><span class="font-bellefair tracking-tight text-red-700">Svelte</span><span class="font-bevan text-[80%] text-red-700">CMS</span></a>
    </div>
    <nav class="text-sm sm:text-xl font-roboto font-light">
      <ul>
        <li><a href="/blog">blog</a></li>
        <li><a href="/docs/introduction">docs</a></li>
        <li class="border-2 border-stone-400 rounded-full"><a href="/docs/getting-started">try it!</a></li>
        {#if import.meta.env.MODE === 'development'}
          <li><a href="/admin">admin</a></li>
        {/if}
      </ul>
    </nav>
  </header>
  <div class="flex flex-col sm:block flex-grow">
    {#if $page.url.pathname.match(/^\/(?:docs|tutorials)(?:\/|$)/)}
      <div class="px-6 flex-grow sm:ml-60">
        <slot />
      </div>
      <div class="not-prose p-6 mt-9 sm:mt-0 sm:m-auto bg-stone-200 dark:bg-stone-700 sm:fixed sm:w-60 sm:left-0 sm:top-0 sm:border-r-2 border-r-stone-700 h-full z-10">
        <DocsContents/>
      </div>
    {:else}
      <slot />
    {/if}
  </div>
</div>

<style lang="postcss">
  nav li { @apply inline-block py-1 px-3; }
  nav li a { @apply text-stone-800 dark:text-white hover:text-cyan-600; }
</style>
