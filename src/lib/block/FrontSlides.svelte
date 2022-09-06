<script lang="ts">
import { fade } from 'svelte/transition'
import { onDestroy } from 'svelte';
import type { Content } from 'sveltecms/core/ContentStore';
import { page } from '$app/stores'

  export let item:Content & { slides:Content[] }

  let i = parseInt($page.url.searchParams.get('i')) || 0
  let heading
  let text

  $: if (i || item.slides?.[i]) {
    heading = (item?.slides?.[i]?.heading || '').toString()
    text = (item?.slides?.[i]?.text || '').toString()
  }

  function autonext() {
    if (i === item.slides.length - 1) i = -5
    else i++
  }

  const timing = 4200
  let interval = setInterval(autonext, timing)
  onDestroy(() => { clearInterval(interval) })

</script>

<section class="hero" on:pointerenter="{()=>{clearInterval(interval)}}" on:pointerleave="{()=>{interval = setInterval(autonext, timing)}}">

  <div class="hero-links">
    {#each item.slides as slide, idx}
      {#if slide?.icon?.['src']}
        <a href="?i={idx}" on:click|preventDefault={()=>{ clearInterval(interval); i=idx; }}>
          <img
            class:on={idx === i}
            src="{slide.icon['src']}"
            alt="{slide.icon?.['alt'] || ''}"
            title="{slide.icon?.['alt'] || ''}"
          >
        </a>
      {/if}
    {/each}
    &nbsp;<span class="red">SvelteCMS</span>
  </div>

  <div class="hero-content">


    {#if i < -1}
    <div class="hero-title">
      <div transition:fade|local>
        <h1>SvelteCMS</h1>
        <h3 class="red big">it's&nbsp;<wbr/>really&nbsp;<wbr/>yours.</h3>
      </div>
    </div>
    {:else if i > -1}
    <div class="hero-title">
      <h2>What if your<br>
        {#if heading}
          <span class="red" transition:fade|local>{heading}</span>
        {/if}
        <br>were really yours
      </h2>
    </div>
    {/if}

    {#if text}
      <div class="text" transition:fade|local>{@html text.replace(/sveltecms/i, '<span class="red">SvelteCMS</span>')}</div>
    {/if}

    <!-- <Button {button}/> -->


  </div>

  <div id="_"><span class="fn">*</span>&nbsp; statements are in some measure aspirational</div>
</section>

<style>
  h1,h2,h3 {
    font-weight: bold;
    line-height: 1.25em;
  }
  .hero {
    position:relative;
    width:100%;
    height:80vh;
  }
  .hero:before {
    content:"";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    background-image: url(/images/pexels-andrea-piacquadio-3861923.jpg);
    filter: contrast(1.3) saturate(1.2);
  }
  .hero-links {
    position: absolute;
    bottom: 1.4em;
    right: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hero-links img {
    height: 24px;
    width: 24px;
    opacity: .5;
    cursor: pointer;
  }
  .hero-links .on {
    filter:invert(.44) sepia() saturate(2.1) hue-rotate(-55deg);
    opacity: 1;
  }
  .hero-content {
    position: absolute;
    top: 4%;
    right: 5%;
    width: 40%;
    text-align: right;
    color: var(--dark);
  }
  .hero-title div {
    position: absolute;
    right: 0;
  }
  h1 {
    font-size: 4vh;
  }
  h2 {
    font-size: 4vh;
  }
  h3.big {
    font-size: 5vh;
    line-height: 1em;
    margin-top: 1.2em;
    user-select: none;
  }
  .text {
    font-size: 1.8vh;
    margin-left: 25%;
    text-shadow: 1px 1px 2px white, -1px -1px 2px white;
  }
  :global(.red) {
    color: indianred;
  }
  h2>span {
    position: absolute;
    right: 0;
    font-size: 5vh;
  }
  :global(.fn) {
    display: inline-block;
    position: absolute;
    font-size: 80%;
    margin-top: -.15em;
    margin-left: -.1em;
  }
  #_ {
    position: absolute;
    bottom: .2em;
    right: 2em;
    opacity: .7;
    color: var(--dark);
    font-size: 11px;
    background: rgba(255,255,255,.7);
    padding: .3em 1em;
    border-radius: 4px;
    box-shadow: -2px 0 10px white;
  }
  @media (orientation:landscape) and (max-height:400px) {
    h1,h2 { font-size: 3vw; }
    h2>span { font-size: 4vw; }
    h3.big { font-size: 4vw; }
    .text { font-size: 2vw; }
  }
</style>