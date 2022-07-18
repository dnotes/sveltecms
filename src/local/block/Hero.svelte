<script lang="ts">
import Button from '$lib/element/Button.svelte'
import type { Content } from 'sveltecms/core/ContentStore';
import type { Media } from 'sveltecms/core/MediaStore';
export let item:Content & {
  image?: string|Media
  heading?: string
  text?: string
  imageFilter?: string
  textStyle?: string
}

</script>

<section class="hero">

  <div class="hero-image"
    style:background-image="url({item.image?.['src'] ?? item.image})"
    style:filter="{item.imageFilter}"
  />

  <div class="hero-content"
    style={item.textStyle}
  >

    {#if item.heading}
    <h2>{@html item.heading}</h2>
    {/if}

    {#if item.text}
    <div class="text">{@html item.text}</div>
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