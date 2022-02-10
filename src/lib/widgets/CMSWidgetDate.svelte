<script lang="ts">
import type { SvelteCMSContentField } from "..";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

  let splitValue = {
    date: '',
    time: '',
  }
  function pad(num, len = 2) { return num.toString().padStart(2,0) }
  let initialized

  $:  if (splitValue.date) value = `${splitValue.date}${splitValue.time ? 'T' + splitValue.time : ''}`
      else if (value && !initialized) {
        initialized = true
        let calc = value instanceof Date ? value : new Date(value)
        let date = `${pad(calc.getFullYear(),4)}-${pad(calc.getMonth()+1)}-${pad(calc.getDate())}`
        let time = `${pad(calc.getHours())}:${pad(calc.getMinutes())}:${pad(calc.getSeconds())}`
        splitValue = { date,time }
        value = `${splitValue.date}T${splitValue.time}`
      }
      else {
        value = ''
        splitValue.date = ''
        splitValue.time = ''
      }

  //@ts-ignore
  let opts:{min?:number,max?:number,time?:boolean} = field.widget.options

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>

  <input
    name="{id}[date]"
    title={field.tooltip}
    type="date"
    bind:value={splitValue.date}
    disabled={field.disabled}
    required={field.required}
    min={opts?.min}
    max={opts?.max}
  />
  {#if opts.time}
  <input
    name="{id}[time]"
    title={field.tooltip}
    type="time"
    bind:value={splitValue.time}
    disabled={field.disabled || !splitValue.date }
    required={field.required}
  />
  {/if}
</label>
