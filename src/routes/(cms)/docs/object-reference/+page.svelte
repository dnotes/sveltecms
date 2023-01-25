<script lang="ts">
  import items from './_items'
  import Table from './_object-reference-table.svelte'
</script>

<div class="prose prose-stone dark:prose-invert max-w-full">

<h1>SvelteCMS Object Reference</h1>

  {#each items as item}
    <div>
      <h2>{item.label}</h2>
      <p>{item.description}</p>
      {#if item.configFields.length}
        <Table
          headings={['property', 'type', 'default', 'script', 'description']}
          items={item.configFields || []}
        />
      {:else}
        <p>{item.labelPlural} do not have shared configurable properties{#if item.isConfigurable}, though individual {item.labelPlural} may have configurable options.{:else}.{/if}</p>
      {/if}
      {#if item?.detailHeading}
        <ul>
          <h3>{item.detailHeading}</h3>
          {#if !item?.detail?.[0]?.heading}
            <Table headings={item.itemsHeadings} />
          {/if}
          {#each item.detail as detailItem}
            <li>
              {#if detailItem.heading}
                <h3>{detailItem.heading}</h3>
                {#if detailItem.description}
                  <p>{detailItem.description}</p>
                {/if}
              {/if}
              {#if detailItem?.items?.length}
                <Table
                  showHeadings={detailItem.heading ? true : false}
                  headings={item.itemsHeadings}
                  items={detailItem.items}
                />
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}

</div>
