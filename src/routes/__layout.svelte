<script>
  import "../app.css";
  import Button from "sveltecms/ui/Button.svelte";
</script>

<div id="page" class="sveltecms">
  <header>
    <nav>
      <ul>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer />
</div>

<style>
  @import "sveltecms/sveltecms-forms.css";
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
