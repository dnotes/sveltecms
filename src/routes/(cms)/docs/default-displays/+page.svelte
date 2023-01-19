<script lang="ts">
  import CMS from 'sveltecms'
  import defaultContent from 'sveltecms/plugins/defaultContent'
  import markdown from 'sveltecms/plugins/markdown'

  const cms = new CMS({}, [markdown(), defaultContent])
  let displayModes = ['default', 'page', 'teaser', 'reference']

</script>

<h2>Default displays</h2>

<pre>
  {JSON.stringify(cms.displays, null, 2)}
</pre>

<h2>Content Types</h2>

{#each Object.entries(cms.contentTypes) as [id, item]}
  <h3>{item.label}</h3>
  {#each displayModes as mode}
    <li><b>{mode}:</b> <pre>{JSON.stringify(item?.displays?.[mode]) + '\n' + JSON.stringify(cms.getEntityDisplayConfig('contentType', item, mode))}</pre></li>
  {/each}
  <table>
    <tr>
      <th>field</th>
      {#each displayModes as mode}
        <th>{mode}</th>
      {/each}
    </tr>
    {#each Object.entries(item.fields) as [id, field]}
      <tr>
        <td>{field.id}</td>
        {#each displayModes as mode}
          <td><pre>{JSON.stringify(field?.displays?.[mode]) + '\n' + JSON.stringify(cms.getEntityDisplayConfig('field', field, mode))}</pre></td>
        {/each}
      </tr>
    {/each}
  </table>
  <hr>
{/each}

<h2>Fields</h2>
<table>
  <tr>
    <th>field</th>
    {#each displayModes as mode}
      <th>{mode}</th>
    {/each}
  </tr>
  {#each Object.entries(cms.fields) as [id, field]}
    <tr>
      <td>{id}</td>
      {#each displayModes as mode}
        <td><pre>{JSON.stringify(field?.displays?.[mode]) + '\n' + JSON.stringify(cms.getEntityDisplayConfig('field', field, mode))}</pre></td>
      {/each}
    </tr>
  {/each}
</table>

<h2>Field Types</h2>
<table>
  <tr>
    <th>field</th>
    {#each displayModes as mode}
      <th>{mode}</th>
    {/each}
  </tr>
  {#each Object.entries(cms.fieldTypes) as [id, field]}
    <tr>
      <td>{id}</td>
      {#each displayModes as mode}
        <td><pre>{JSON.stringify(field?.displays?.[mode]) + '\n' + JSON.stringify(cms.getEntityDisplayConfig('field', field, mode))}</pre></td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  pre { display: inline-block; font-size: 12px; }
</style>