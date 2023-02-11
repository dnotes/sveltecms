<script>import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
function cancel() {
    dispatch('cancel');
}
export let small = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="{small ? 'modalbg-small' : 'modalbg'}" on:click|stopPropagation={cancel}>
<div class="modal" class:small on:click|stopPropagation on:keydown={(e)=>{if (e.key === 'Escape') cancel()}}>
  <div class="title"><slot name="title"></slot></div>
  <div class="body"><slot></slot></div>
</div>
</div>

<style>
  .modalbg, .modalbg-small {
    z-index:11;
    background:rgba(0,0,0,.4);
    -webkit-user-select:none;
       -moz-user-select:none;
            user-select:none;
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    display:flex;
    padding: 40px 0;
  }
  .modal {
    top: 60px;
    height: calc(100% - 120px);
    overflow: scroll;
    background:var(--cms-bg);
    flex-grow:1;
    margin-left:40px;
    margin-top:100px;
  }
  .modal.small {
    position: fixed;
    margin-left: 0;
    top: 50%;
    left: 50%;
    height: auto;
    max-height: 80vh;
    max-width: 80vw;
    min-height: 240px;
    min-width: 360px;
    background:var(--cms-bg);
    transform:translate3d(-50%,-50%,0);
  }
  .modal>div.body {
    padding: 20px;
  }
  .modal>div.title:not(:empty) {
    position: sticky;
    top: 0;
    padding: 8px 20px;
    background-color: var(--cms-bg);
    z-index: 1;
  }
  .modalbg :global(.modalbg) {
    margin-left:40px;
    width: calc(100% - 40px);
  }
  .modalbg :global(.modalbg .modalbg) {
    margin-left:80px;
    width: calc(100% - 80px);
  }
  .modalbg :global(.modalbg .modalbg .modalbg) {
    margin-left:120px;
    width: calc(100% - 120px);
  }
  .modalbg :global(.modalbg .modalbg .modalbg .modalbg) {
    margin-left:160px;
    width: calc(100% - 160px);
  }
  .modalbg :global(.modalbg .modalbg .modalbg .modalbg .modalbg) {
    margin-left:200px;
    width: calc(100% - 200px);
  }</style>
