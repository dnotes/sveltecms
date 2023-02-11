<script>
  import "sveltecms/sveltecms-forms.css"
  let js=true
</script>
{#if js}
<slot></slot>
{/if}

<noscript>The admin section requires javascript.</noscript>