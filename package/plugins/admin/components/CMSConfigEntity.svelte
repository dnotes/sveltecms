<script>import CmsFieldGroup from '../../../CMSFieldGroup.svelte';
export let cms;
export let data;
export let options;
$: opts = Object.assign({}, options);
$: entityType = cms.getEntityType(opts.configType);
$: widgetFieldGroup = cms.getWidgetFields(cms.getEntityConfigFieldgroup(entityType.id), { values: data, errors: {}, touched: {}, id: options.configPath });
</script>

<CmsFieldGroup {cms} {widgetFieldGroup} bind:values={data} />
