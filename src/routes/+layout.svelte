<script>
  import "sveltecms/sveltecms-forms.css";
  import Button from "sveltecms/ui/Button.svelte";
  import "../app.css";
</script>

<div id="page" class="sveltecms">
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/docs">Docs</a></li>
        <Button highlight href="/docs/getting-started" text="Try it!" />
        {#if import.meta.env.MODE === 'development'}
          <li><a href="/admin">Admin</a></li>
        {/if}
      </ul>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer />
</div>

<style>
  #page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
  }
  main {
    flex-grow: 1;
  }
  nav {
    font-size: 1.6vh;
  }
  ul li {
    display: inline-block;
    padding: 0.3em 0.7em;
  }
  @media (orientation: landscape) and (max-height: 400px) {
    nav {
      font-size: 1.7vw;
    }
  }
</style>
