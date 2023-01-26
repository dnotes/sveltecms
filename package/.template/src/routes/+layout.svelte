<script>
  // This file was created by SvelteCMS, but feel free to change it.
  // This is the root layout for all pages of your site.
  import '../app.css'
</script>

<div id="page">

  <header>
    <div class="sitename">Your Site Name</div>
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
      {#if import.meta.env.MODE === 'development'}
        <a href="/admin">Admin</a>
      {/if}
    </nav>
  </header>

  <div id="main">
    <slot></slot>
  </div>

</div>

<style>
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 4px 20px;
    background: rgba(0,0,0,.4);
  }
  div.sitename {
    font-size: 200%;
    flex-grow: 1;
  }
  nav {
    display: flex;
    gap: 2px;
  }
  nav a {
    display: block;
    padding: 2px 8px;
  }

</style>
