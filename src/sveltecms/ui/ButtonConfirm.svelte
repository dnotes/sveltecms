<script lang="ts">
import { createEventDispatcher } from "svelte";
import Modal from "./Modal.svelte";
import Button from "./Button.svelte";

const dispatch = createEventDispatcher()

  export let submit:boolean = undefined
  export let disabled:boolean = undefined
  export let small:boolean = undefined
  export let borderless:boolean = undefined
  export let highlight:boolean = undefined
  export let primary:boolean = undefined
  export let danger:boolean = undefined
  export let helptext:string = ''

  export let formaction:string = undefined

  // Some buttons navigate.
  // This is easier than making a Link component or using goto.
  export let href:string = undefined

  // This is for the <slot> default
  export let title:string
  export let text:string = ''

  let show

</script>

<Button
  on:click={()=>{show=true}}
  {disabled}
  {small}
  {borderless}
  {highlight}
  {primary}
  {danger}
  {helptext}
  {href}
  {text}
  {submit}
/>

{#if show}
  <Modal small on:cancel={()=>{show=false}}>
    <h2 slot="title">{title}</h2>
    <div class="container">
      <div class="detail">
        <slot></slot>
      </div>
      <div class="actions">
        <slot name="confirm"><Button danger {formaction} on:click={()=>{dispatch('confirm'); show=false;}}><slot name="text">{text}</slot></Button></slot>
        <Button borderless on:click={()=>{show=false}}>Cancel</Button>
      </div>
    </div>
  </Modal>
{/if}

<style>
  div.container { display:flex; flex-direction:column; }
  div.detail { padding-bottom:20px; min-height:95px; }
  div.actions { display:flex; justify-content:center; }
</style>