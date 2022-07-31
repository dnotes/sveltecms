<script>import Tags from 'svelte-tags-input';
import { onMount } from 'svelte';
export let cms;
export let field;
export let id;
export let value = field.default;
//@ts-ignore
let opts = field.widget.options ?? {};
let contentTypes = opts.contentTypes || cms.listEntities('contentType');
let autoComplete;
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
    bind:tags={value}
    disable={field.disabled}
    placeholder={opts.placeholder}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    onlyUnique
    {autoComplete}
    autocompleteFilter={false}
    autoCompleteKey={opts.inputField || '_slug'}
    onlyAutocomplete={opts.allowNewContent ? false : true}
    allowBlur={opts.allowBlur}
    minChars={opts.minChars}
    labelText={field.label}
  />
  {#each value as item}
    <input type="hidden" name="{id}" value="{item?._slug ? `${item._type}/${item._slug}` : item}" />
  {/each}
</label>
