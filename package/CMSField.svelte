<script>import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetFieldgroup from './widgets/CMSWidgetFieldgroup.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import ScriptableButton from './ui/ScriptableButton.svelte';
export let cms;
export let id;
export let field;
export let value;
let cls = "";
export { cls as class };
let overridden = false;
let scriptValue = "";
</script>

{#if !field.hidden}
  <div class="field field-{id} {cls} {field?.class || ''}">
    {#if !field?.widget?.widget}
      <CmsWidgetUndefined {field} {id} />
    {:else if field.multiple && !field.widget.handlesMultiple}
      <CmsWidgetMultiple
        {field}
        {id}
        bind:value
        {cms}
      />
    {:else if field.widget.type === 'fieldgroup'}
      <CmsWidgetFieldgroup
        {field}
        {id}
        bind:value
        {cms}
      />
    {:else}
      {#if overridden}
        <svelte:component
          this={field.widget.widget}
          {field}
          {id}
          {cms}
          value={undefined}
          disabled={true}
        />
        <ScriptableButton
          {cms}
          {field}
          bind:value
          bind:overridden
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          {id}
          {cms}
          bind:value
        />
        {#if field.scriptable}
          <ScriptableButton
            {cms}
            {field}
            bind:value={scriptValue}
            bind:overridden
          />
        {/if}
      {/if}
    {/if}
    {#if field.helptext}
      <div class="cms-helptext">{field.helptext}</div>
    {/if}
  </div>
{/if}
