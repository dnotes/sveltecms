<script lang="ts">
  import Button from 'sveltecms/ui/Button.svelte'
  import Modal from 'sveltecms/ui/Modal.svelte';

  let buttonOptions:{
    type:""|"cancel"|"configure"|"fn",
    [key:string]:any
  } = {
    type: "",
    submit: false,
    disabled: false,
    small: false,
    borderless: false,
    highlight: false,
    primary: false,
    danger: false,
    helptext: '',
    href: '',
    text: 'text',
  }

  let showModal=false
  let modalOptions = {
    title: 'Title',
    small: false,
  }

</script>

<div class="prose prose-xl dark:prose-invert sveltecms">

  <h1>User Interface Elements</h1>

  <p>
    SvelteCMS uses the following elements throughout its Admin UI,
    and third-party plugins designed to integrate with SvelteCMS
    should use these UI elements in all of the following:
  </p>

  <ul>
    <li>Any component used for a Widget</li>
    <li>Any component used for an Admin Page</li>
  </ul>
</div>

<div class="page-main">

  <!-- BUTTON -->
  <h2>Button</h2>
  <div class="component">

    <div class="options sveltecms">
      {#each Object.keys(buttonOptions) as k}
        <div>
          <label>
            {#if k === 'type'}
              <span>type</span>
              <select bind:value={buttonOptions.type}>
                <option value="">- none -</option>
                <option value="cancel">cancel</option>
                <option value="configure">configure</option>
                <option value="fn">fn</option>
              </select>
            {:else if typeof buttonOptions[k] === 'boolean'}
              <input type="checkbox" bind:checked={buttonOptions[k]}>
              <span>{k}</span>
            {:else if typeof buttonOptions[k] === 'string'}
              <span>{k}</span>
              <input type="text" bind:value={buttonOptions[k]}>
            {/if}
          </label>
        </div>
      {/each}
    </div>

    <div class="preview">
      <div class="inline-block">
        <Button
          bind:type={buttonOptions.type}
          bind:submit={buttonOptions.submit}
          bind:disabled={buttonOptions.disabled}
          bind:small={buttonOptions.small}
          bind:borderless={buttonOptions.borderless}
          bind:highlight={buttonOptions.highlight}
          bind:primary={buttonOptions.primary}
          bind:danger={buttonOptions.danger}
          bind:helptext={buttonOptions.helptext}
          bind:href={buttonOptions.href}
          bind:text={buttonOptions.text}
        >
        </Button>
      </div>
    </div>

  </div>
  <!-- END BUTTON -->

  <h2>Modal</h2>
  <div class="component">
    <div class="options sveltecms">
      (options in the Modal window)
    </div>
    <div class="component">
      <Button on:click={()=>{showModal=true}}>Show modal</Button>
      {#if showModal}
        <Modal small={modalOptions.small} on:cancel={()=>{showModal=false}}>
          <div slot="title">
            {#if modalOptions.title}
              <pre>&lt;h3 slot="title"></pre>
                <h3>{modalOptions.title}</h3>
              <pre>&lt;/h3></pre>
            {/if}
          </div>
          <div>
            <pre>&lt;div></pre>
              <div class="field">
                <label>
                  <input type="checkbox" bind:checked={modalOptions.small}>
                  <span>Small</span>
                </label>
              </div>
              <div class="field">
                <label for="">
                  <span>Title</span>
                  <input type="text" bind:value={modalOptions.title}>
                </label>
              </div>
            <pre>&lt;/div></pre>
          </div>
        </Modal>
      {/if}
    </div>
  </div>

</div>



<style lang="postcss">
  h2 {
    background: var(--cms-main);
    padding: 2px 19px;
  }
  .component {
    display: flex;
    flex-wrap: wrap;
    padding: 19px;
  }
  .component>div {
    flex-grow: 1;
  }
  div.options {
    width:300px;
  }
  div.preview {
    width:500px;
  }
  div.preview {
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .inline-block { display:inline-block; }

  pre {
    opacity:.4;
    font-size: 80%;
  }
</style>