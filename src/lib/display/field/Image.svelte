<script lang="ts">
  export let value:string|{
    src:string,
    alt?:string,
    title?:string
  }
</script>

<img src={value?.['src'] ?? value} alt={value?.['alt'] ?? ''} title={value?.['title'] ?? ''} />