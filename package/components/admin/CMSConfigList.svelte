<script>export let cms;
export let adminPath;
$: [key] = adminPath.split('/');
$: items = Object.entries(cms[key]);
</script>

<ul>

</ul>
