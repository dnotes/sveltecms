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
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:11;
    padding: 1em;
    max-width: 85vw;
    max-height: 92vh;
    overflow-y:scroll;
    background:var(--cms-background);
  }
</style>
