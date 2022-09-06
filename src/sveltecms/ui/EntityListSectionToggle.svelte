<script lang="ts">
  export let section = 'config'
</script>

<div>
  {#if section === 'config'}
    <span>config</span>
    <a href="?section=display" on:click|preventDefault={()=>{section="display"}}>display</a>
  {:else}
    <a href="?section=config" on:click|preventDefault={()=>{section="config"}}>config</a>
    <span>display</span>
  {/if}
</div>

<style>
  div {
    border-radius: 8px;
    padding: .2em;
    border: 1px solid var(--cms-main);
  }
  a,span {
    padding: .1em .3em;
    display: inline-block;
    user-select: none;
  }
  a:first-child,span:first-child {
    padding-left: .4em;
    border-radius: 5px 0 0 5px;
  }
  a:last-child,span:last-child {
    padding-right:.4em;
    border-radius: 0 5px 5px 0;
  }
  span {
    background: var(--cms-main);
    color: var(--cms-bg);
  }
</style>