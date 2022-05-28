<script lang="ts">
import { fade, fly } from 'svelte/transition'
import { onDestroy } from 'svelte';

  export let slides

  let i = 0
  let heading = ''
  let text = ''

  $: if (i || slides?.[i]) {
    heading = ''
    text = ''
    setTimeout(populate, 500)
  }

  function next() {
    if (i === slides.length - 1) i = -5
    else i++
  }

  function populate() {
    heading = slides?.[i]?.heading || ''
    text = slides?.[i]?.text || ''
  }

  const interval = setInterval(next, 4200)
  onDestroy(() => { clearInterval(interval) })

</script>

<section class="hero">

  <div class="hero-content">


    {#if i < -1}
    <div class="hero-title">
      <div transition:fade>
        <h1>SvelteCMS</h1>
        <h3 class="red big">It's&nbsp;<wbr/>really&nbsp;<wbr/>yours.</h3>
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
      <div class="text" transition:fade|local>{@html text}</div>
    {/if}

    <!-- <Button {button}/> -->


  </div>

  <div id="_">* statements are to some degree aspirational</div>
</section>

<style>
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
    user-select: none;
  }
  .text {
    font-size: 1.8vh;
    margin-left: 25%;
    text-shadow: 1px 1px 2px white, -1px -1px 2px white;
  }
  .red {
    color: indianred;
  }
  h2>span {
    position: absolute;
    right: 0;
    font-size: 5vh;
    margin-top:-.5vh;
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
    h2>span { font-size: 4vw; margin-top:-.5vw; }
    h3.big { font-size: 4vw; }
    .text { font-size: 2vw; }
  }
</style>