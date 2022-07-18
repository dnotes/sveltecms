<script lang="ts">
  export let item:string|{
    src:string,
  }
  let filepath = typeof item === 'string' ? item : item.src
  let filename = filepath.replace(/.+\//,'')
</script>

<a href="{filepath}">{filename}</a>
