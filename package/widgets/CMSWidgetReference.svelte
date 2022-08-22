<script>import Tags from 'svelte-tags-input';
import { onMount } from 'svelte';
import SlugConfig from 'sveltecms/core/Slug';
export let cms;
export let field;
export let id;
export let value = field.default;
//@ts-ignore
let opts = field.widget.options ?? {};
// Ensure that contentTypes is an array
let contentTypes = Array.isArray(opts.contentTypes)
    ? opts.contentTypes
    : (opts.contentTypes ? [opts.contentTypes] : cms.listEntities('contentType'));
// Setup variable for autoComplete search function
let autoComplete;
// Slug configuration for this index (if needed)
let slugConfig = new SlugConfig(opts.displayKey, cms);
let tags = (Array.isArray(value) ? value : (typeof value === 'undefined' || value === '' || value === null ? [] : [value]));
function handleTags(e) {
    let tags = (e?.detail?.tags ?? []).map(item => (typeof item !== 'string' ? item : {
        _type: contentTypes[0],
        _slug: cms.getSlug({ [opts.displayKey]: item }, slugConfig, true),
        [opts.displayKey]: item,
    }));
    if (!field.multiple || (field.multipleOrSingle && tags.length === 1))
        value = tags[0];
    else
        value = tags.length ? tags : undefined;
}
onMount(async () => {
    autoComplete = async (value) => {
        let content = await cms.listContent(contentTypes, value);
        return content.filter(item => item._type !== field.values._type || item._slug !== field.values._slug);
    };
});
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <Tags
    bind:tags
    on:tags={handleTags}
    disable={field.disabled}
    placeholder={opts.placeholder}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    onlyUnique
    {autoComplete}
    autoCompleteFilter={false}
    autoCompleteKey={opts.displayKey || '_slug'}
    onlyAutocomplete={(contentTypes.length === 1 && opts.freeTagging) ? false : true}
    allowBlur={opts.allowBlur}
    minChars={opts.minChars}
    labelText={field.label}
  />
  {#each tags as item}
    <input type="hidden" name="{id}" value="{item?._slug ? `${item._type}/${item._slug}` : item}" />
  {/each}
</label>
