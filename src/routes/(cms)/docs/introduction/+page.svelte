<script lang="ts">
  import type { PageData } from "./$types";
  export let data:PageData
</script>

<div class="prose prose-stone prose-lg dark:prose-invert mx-auto">
  {@html data.intro}

  {#if data?.content?.body}
    {@html data.content.body}
  {/if}
</div>
