<script lang="ts">
import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher()
  function cancel() {
    dispatch('cancel')
  }
</script>

<div class="modalbg" on:click|stopPropagation={cancel}></div>
<div class="modal" on:keydown={(e)=>{if (e.key === 'Escape') cancel()}}>
  <slot></slot>
</div>

<style>
  .modalbg {
    z-index:10;
    background:rgba(0,0,0,.4);
    user-select:none;
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
  }
  .modal {
    position:fixed;
    right: 0;
    top: 60px;
    height: calc(100% - 80px);
    z-index:11;
    padding: 1em;
    overflow-y:scroll;
    overflow-x: hidden;
    background:var(--cms-bg);
  }
  :global(.sveltecms .modal) { width:calc(100% - 20px) }
  :global(.sveltecms .modal .modal) { width:calc(100% - 40px) }
  :global(.sveltecms .modal .modal .modal) { width:calc(100% - 60px) }
  :global(.sveltecms .modal .modal .modal .modal) { width:calc(100% - 80px) }
  :global(.sveltecms .modal .modal .modal .modal .modal) { width:calc(100% - 100px) }
</style>
