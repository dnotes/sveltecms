import type { CMSPlugin } from "sveltecms/core/Plugin";
import CheckboxText from "./CheckboxText.svelte";

export const plugin:CMSPlugin = {
  id: 'checkboxes',
  widgetTypes: [
    {
      id: 'checkbox-text',
      description: 'Replaces the standard HTML checkbox input with a text-based input that should scale.',
      widget: CheckboxText,
      fieldTypes: ['boolean'],
      optionFields: {
        falseText: {
          type: 'text',
          size: '1',
          default: '☐',
          scriptable: true,
          helptext: 'Character to show when the checkbox is not checked.',
        },
        trueText: {
          type: 'text',
          size: '1',
          default: '☑︎',
          scriptable: true,
          helptext: 'Character to show when the checkbox is not checked.',
        },
        fontSize: {
          type: 'number',
          default: 150,
          scriptable: true,
          helptext: 'The relative size of the checkbox text, as a percentage.',
          widget: {
            type: 'number',
            options: {
              min: 10,
              max: 500,
              step: 5,
            }
          }
        },
        labelBeforeCheckbox: {
          type: 'boolean',
          default: false,
          scriptable: true,
          helptext: 'Render the text label before the checkbox element in HTML markup.',
        },
      }
    }
  ]
}

export default plugin