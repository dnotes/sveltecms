<script>import Tags from 'svelte-tags-input';
export let field;
export let id;
export let value = field.default;
//@ts-ignore
let opts = field.widget.options;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <Tags
    bind:tags={value}
    name={id}
    disable={field.disabled}
    placeholder={opts.placeholder}
    allowPaste={opts.allowPaste}
    allowDrop={opts.allowDrop}
    splitWith={opts.splitWith}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    allowBlur={opts.allowBlur}
    onlyUnique={opts.onlyUnique}
    autoComplete={opts.items}
    onlyAutocomplete={opts.restrictToItems}
    autoCompleteKey={opts.itemsKey}
    autoCompleteFilter={opts.itemsFilter}
    minChars={opts.minChars}
    labelText={field.label}
  />
</label>
