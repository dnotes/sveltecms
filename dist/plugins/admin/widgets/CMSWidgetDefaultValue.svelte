<script>import Field from '../../../core/Field';
export let cms;
export let field;
export let id;
export let value = field.default;
let defaultField;
async function getDefaultField() {
    try {
        return new Field('default', { ...field.values, default: undefined, required: false, hidden: false, disabled: false }, cms);
    }
    catch (e) {
        return false;
    }
}
$: if (cms && field?.values && field?.widget?.options)
    defaultField = getDefaultField();
</script>

<label>
  <span>
    <slot>{field?.label}</slot>
  </span>
  {#await defaultField then defaultField}
    {#if defaultField}
      <svelte:component this={defaultField.widget.widget} {cms} {id} field={defaultField} bind:value />
    {/if}
  {/await}
</label>
