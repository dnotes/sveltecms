<script lang="ts">
import Button from '$lib/element/Button.svelte'
  export let image
  export let heading = ''
  export let text = ''
  export let imageFilter = ''
  export let textStyle = ''

</script>

<section class="hero">

  <div class="hero-image"
    style:background-image="url({image?.src ?? image})"
    style:filter="{imageFilter}"
  />

  <div class="hero-content"
    style={textStyle}
  >

    {#if heading}
    <h2>{@html heading}</h2>
    {/if}

    {#if text}
    <div class="text">{@html text}</div>
    {/if}

    <!-- <Button {button}/> -->

  </div>

</section>

<style>
  .hero {
    position:relative;
    width:100%;
    height:100vh;
  }
  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
  .hero-content {
    position: absolute;
    color: var(--dark);
  }
  h2 {
    font-size: 4vh;
  }
  .text {
    font-size: 1.5vh;
  }
</style>