<script>export let value;
let filepath = typeof value === 'string' ? value : value.src;
let filename = filepath.replace(/.+\//, '');
</script>

<a href="{filepath}">Download {filename}</a>
