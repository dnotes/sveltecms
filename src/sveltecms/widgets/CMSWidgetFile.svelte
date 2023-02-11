<script lang="ts">
  import type { WidgetField } from '..';
  import type { Media } from "../core/MediaStore";
  import type SvelteCMS from "..";
  import MediaChooser from "./MediaChooser.svelte";
  import CmsWidgetAudioPreview from "./CMSWidgetFilePreview.svelte";

  /**
   * The File Widget works with the SvelteCMS Media Chooser to provide Media input.
   * With the Media Chooser, this Widget will handle storing all Content and Value data,
   * while SvelteCMS handles storing the actual files.
   */

    export let cms:SvelteCMS
    export let field:WidgetField
    export let id:string

    // The "value" variable is where we store the url strings or Media objects for the database.
    // SvelteCMS supports files saved as a string, but it converts them to Media objects when edited.
    // To support live preview, each "value" must include viable URLs for images or uploaded blobs.
    export let value:Media|Media[]|undefined = undefined
    value = Array.isArray(value)
      ? value.map(v => typeof v === 'string' ? {src:v} : v)
      : typeof value === 'string' ? { src:value } : value

    export let deleteFile = (i?:number) => {
      // For deleting an image, we just remove it from the value.
      // It will then be removed from previews automatically
      // (see the line `$: previews =` above)
      if (Array.isArray(value) && value.length > 1) {
        value.splice(i, 1)
        value = value
      }
      else value = undefined
    }

  </script>

  <fieldset class="cms-file" class:multiple={field.multiple}>

    <label>
      <span style="display:inline-block;">
        <slot>{field.label}</slot>
      </span>
    </label>

    {#if value && Object.keys(value).length}
      <div class="cms-file-widget">
        {#if Array.isArray(value)}
          {#each value as img, i}
            <CmsWidgetAudioPreview id="{id}[{i}]" bind:value={img} {cms} {field} on:delete={()=>{deleteFile(i)}}/>
          {/each}
        {:else if value}
          <CmsWidgetAudioPreview id="{id}[0]" bind:value {cms} {field} on:delete={()=>{deleteFile()}}/>
        {/if}
      </div>
    {/if}

    <MediaChooser bind:value {field} {id} {cms} />

  </fieldset>

  <style>
    .cms-file-widget {
      display:flex;
      flex-direction:column;
      flex-wrap:wrap;
      gap:1em;
      width:100%;
      padding:1em 0;
    }
  </style>