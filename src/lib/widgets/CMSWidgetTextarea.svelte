<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{placeholder?:string,rows?:number,cols?:number} = field.options

</script>

<label>
  <span>
    <slot>{field.title}</slot>
  </span>
  <textarea
    name={id}
    title={field.description}
    bind:value
    rows="{opts?.rows ?? undefined}"
    cols="{opts?.cols ?? undefined}"
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
  />
</label>
