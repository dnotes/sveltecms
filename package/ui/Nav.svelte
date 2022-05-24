<script>import { getLabelFromID } from "sveltecms/utils";
export let cms;
export let adminPath;
export let basePath;
let sections = Object.values(cms.adminPages)
    .filter(o => !o.id.match('/'))
    .sort();
$: activeSection = adminPath.replace(/\/.+/, '');
$: crumbs = adminPath.split('/').reduce((agg, val, i, arr) => {
    if (i < arr.length - 1) {
        let base = agg.length ? agg[agg.length - 1][1] : '';
        agg.push([val, `${base}/${val}`]);
    }
    return agg;
}, [['admin', '']]);
</script>

<nav>
  {#each sections as section}
    <a href="{basePath}/{section.id}" class:active={activeSection===section.id}>
      {section.label || getLabelFromID(section.id)}
    </a>
  {/each}
</nav>
<div class="breadcrumbs">
  &nbsp;
  {#each crumbs as [name, path], i}
    <a href="{basePath}{path}"> &ltri; {name}</a>
  {/each}
</div>

<style>
  a {
    text-decoration:none;
    display:inline-block;
    vertical-align:middle;
  }
  nav {
    padding:4px 0 0;
    width:100%;
    background:var(--cms-main);
  }
  nav>a {
    border-radius: 5px 5px 0 0;
    padding:2px 10px 4px;
    text-align:center;
    color:var(--cms-background);
  }
  nav>a.active {
    background:var(--cms-background);
    color:var(--cms-main);
  }
  .breadcrumbs a {
    font-size:12px;
    padding-left:8px;
    color:var(--cms-link);
  }
</style>