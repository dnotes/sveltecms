<script lang="ts">
  import type { Media } from "sveltecms/core/MediaStore";
  export let item:Media
</script>

{#if item && item.src}
<audio controls src="{item.src}" />
{/if}