<script>import { pad, formatTimezoneOffset } from 'sveltecms/utils/date';
export let field;
export let id;
export let value = field.default;
let splitValue = { date: '', time: '', };
let initialized;
let now = new Date();
let tzo = formatTimezoneOffset(now.getTimezoneOffset());
let el;
$: if (value && el) {
    el?.dispatchEvent(new CustomEvent('change'));
}
$: if (splitValue.date) {
    if (!opts.time)
        value = splitValue.date;
    else {
        if (!splitValue.time)
            splitValue.time = `${pad(now.getHours())}:${pad(now.getMinutes())}${opts.seconds ? ':' + pad(now.getSeconds()) : ''}`;
        // This gets the date in local time zone, then outputs it to UTC as an ISO string
        value = new Date(`${splitValue.date}T${splitValue.time}`).toISOString();
    }
}
else if (opts.time === 'timeonly' && splitValue.time) {
    value = splitValue.time;
}
// This is what happens when we first load the widget with a value
else if (value && !initialized) {
    initialized = true;
    let date, time, calc;
    // Get the date from a unix timestamp
    if (typeof value === 'string' && value.match(/^\d+$/))
        calc = new Date(parseInt(value) * 1000);
    else if (typeof value === 'number')
        calc = new Date(value * 1000);
    // For a date or string, continue
    else
        calc = new Date(value);
    try {
        date = `${pad(calc.getFullYear(), 4)}-${pad(calc.getMonth() + 1)}-${pad(calc.getDate())}`;
        time = `${pad(calc.getHours())}:${pad(calc.getMinutes())}${opts.seconds ? ':' + pad(calc.getSeconds()) : ''}`;
    }
    catch (e) { } // ...it's not a date.
    // OK by now we either have a date and time, or we have nothing.
    splitValue = { date: date ?? '', time: time ?? '' };
}
else {
    value = '';
    splitValue.date = '';
    splitValue.time = '';
}
//@ts-ignore
let opts;
$: opts = field.widget.options;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <span>
    <slot>{field.label}</slot>
  </span>

  <input type="hidden" name="{id}" bind:value bind:this={el} />

  {#if opts.time !== 'timeonly'}
    <input
      type="date"
      bind:value={splitValue.date}
      disabled={field.disabled}
      required={field.required}
      min={opts?.minDate}
      max={opts?.maxDate}
    />
  {/if}

  {#if opts.time === 'hidden'}
    <input
      type="hidden"
      bind:value={splitValue.time}
    />
  {:else if opts.time}
    <input
      type="time"
      bind:value={splitValue.time}
      disabled={field.disabled}
      required={field.required}
      min={opts.minTime}
      max={opts.maxTime}
      step={opts.seconds ? 1 : 60}
    />
  {/if}
  <input type="hidden" value={tzo}>
</label>
