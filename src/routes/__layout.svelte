<script>
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
    <slot></slot>
  </main>
  <footer>
  </footer>
</div>

<style>
  @import "sveltecms/sveltecms-forms.css";
  #page { display:flex; flex-direction:column; min-height:100vh; width:100vw; }
  main { flex-grow:1; }
  ul li { display: inline-block; padding: .3em .7em; }
</style>