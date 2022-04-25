<script >export let cms;
export let adminPath;
$: [section, id] = adminPath.split('/');
$: item = cms[section][id];
</script>

