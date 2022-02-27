import { get, has, isEqual, set } from 'lodash-es'
import type { CMSFieldFunctionType,CMSFieldFunctionConfigSetting } from "."

function getFullPath(path, id) {
  if (!path) return id
  if (!id) return path
  return `${path}.${id}`
}

export const functions:{[id:string]:CMSFieldFunctionType} = {
  now: {
    id: 'now',
    fn: () => {
      return new Date()
    }
  },
  contains: {
    id: 'contains',
    fn: (vars,opts) => {
      return opts.textOrArray?.includes(opts.searchFor)
    },
    optionFields: {
      textOrArray: {
        type: 'text',
        default: '',
      },
      searchFor: {
        type: 'text',
        default: '',
      },
    }
  },
  once: {
    id: 'once',
    fn: (vars,opts) => {
      return opts.function
    },
    optionFields: {
      function: {
        type: 'cmsFunction',
        default: null,
      }
    }
  },
  transform: {
    id: 'transform',
    fn: (vars, opts) => {
      return opts.transformer.fn(opts.value, opts.transformer.options)
    },
    optionFields: {
      transformer: {
        type: 'cmsTransformer',
        default: null
      },
      value: {
        type: 'cmsFunction',
        default: {
          function: 'getValue'
        }
      }
    }
  },
  getFieldProperty: {
    id: 'getFieldProperty',
    fn: (vars, opts) => {
      return get(vars.field, opts.property)
    },
    optionFields: {
      property: {
        type: 'text',
        default: '',
      }
    }
  },
  // TODO: get this working. See CMSEditorForm.svelte. Also add getEventProperty.
  // getTargetProperty: {
  //   id: 'getTargetProperty',
  //   fn: (vars, opts, event, el) => {
  //     console.log({event,el})
  //     return vars?.target?.[opts.property]
  //   },
  //   optionFields: {
  //     property: {
  //       type: 'text',
  //       default: 'value',
  //     }
  //   }
  // },
  setFieldProperty: {
    id: 'setFieldProperty',
    fn: (vars, opts) => {
      vars.field[opts.property] = opts.value
    },
    optionFields: {
      property: {
        type: 'text',
        default: '',
      },
      value: {
        type: 'text',
        default: '',
      },
    }
  },
  id: {
    id: 'id',
    fn: (vars, opts) => {
      return opts.id || ''
    }
  },
  getValue: {
    id: 'getValue',
    fn: (vars, opts) => {
      let path = getFullPath(vars.id, opts.fieldID)
      if (has(vars.values, path)) return get(vars.values, path)
      return get(vars.values, opts.fieldID)
    },
    optionFields: {
      fieldID: {
        type: 'text',
        default: {
          function: 'id',
        }
      }
    }
  },
  setValue: {
    id: 'setValue',
    fn: (vars, opts) => {
      let path = getFullPath(vars.id, opts.fieldID)
      if (has(vars.values, path)) set(vars.values, path, opts.value)
      else set(vars.values, opts.fieldID, opts.value)
    },
    optionFields: {
      fieldID: {
        type: 'text',
        default: {
          function: 'id',
        }
      },
      value: {
        type: 'text',
        default: '',
      }
    }
  },
  isError: {
    id: 'isError',
    fn: (vars,opts) => {
      let path = getFullPath(vars.id, opts.fieldID)
      if (has(vars.errors, path)) return get(vars.errors, path)
      return get(vars.errors, opts.fieldID)
    },
    optionFields: {
      fieldID: {
        type: 'text',
        default: {
          function: 'id'
        },
      }
    }
  },
  isTouched: {
    id: 'isTouched',
    fn: (vars, opts) => {
      let path = getFullPath(vars.id, opts.fieldID)
      if (has(vars.touched, path)) return get(vars.touched, path)
      return get(vars.touched, opts.fieldID)
    },
    optionFields: {
      fieldID: {
        type: 'text',
        default: {
          function: 'id'
        },
      }
    }
  },
  not: {
    id: 'not',
    fn: (vars, opts) => {
      return !opts.value
    },
    optionFields: {
      value: {
        type: 'text',
        default: {
          function: 'getValue'
        },
      }
    }
  },
  if: {
    id: 'if',
    fn: (vars, opts) => {
      return opts.condition ? opts.ifTrue : opts.ifFalse
    },
    optionFields: {
      condition: {
        type: 'text',
        default: '',
      },
      ifTrue: {
        type: 'text',
        default: true,
      },
      ifFalse: {
        type: 'text',
        default: false,
      }
    }
  },
  or: {
    id: 'or',
    fn: (vars, opts) => {
      let passed = Object.keys(opts.conditions).filter(k => Boolean(opts[k]))
      return passed.length > 0
    },
    optionFields: {
      conditions: {
        type: 'text',
        multiple: true,
        default: [],
      }
    }
  },
  and: {
    id: 'and',
    fn: (vars, opts) => {
      let passed = Object.keys(opts.conditions).filter(k => Boolean(opts[k]))
      return passed.length > 0
    },
    optionFields: {
      conditions: {
        type: 'text',
        multiple: true,
        default: [],
      }
    }
  },
  equal: {
    id: 'equal',
    fn: (vars, opts) => {
      const number = Object.keys(opts.values).length
      if (number < 2) return false
      const value = opts.values[0]
      let conditions = Object.keys(opts.values).filter(k => isEqual(value, opts.values[k]))
      return (conditions.length === number)
    },
    optionFields: {
      values: {
        type: 'text',
        multiple: true,
        default: [],
      }
    }
  },
  isLessThan: {
    id: 'isLessThan',
    fn: (vars, opts) => {
      return opts.orEqual ? opts.value <= opts.isLessThan : opts.value < opts.isLessThan
    },
    optionFields: {
      value: {
        type: 'text',
        default: '',
      },
      isLessThan: {
        type: 'text',
        default: '',
      },
      orEqual: {
        type: 'boolean',
        default: false,
      }
    }
  },
  isGreaterThan: {
    id: 'isGreaterThan',
    fn: (vars, opts) => {
      return opts.orEqual ? opts.value >= opts.isGreaterThan : opts.value > opts.isGreaterThan
    },
    optionFields: {
      value: {
        type: 'text',
        default: '',
      },
      isGreaterThan: {
        type: 'text',
        default: '',
      },
      orEqual: {
        type: 'boolean',
        default: false,
      }
    }
  },
  isNull: {
    id: 'isNull',
    fn: (vars, opts) => {
      return (opts?.value === undefined || opts?.value === null)
    },
    optionFields: {
      value: {
        type: 'text',
        default: {
          function: 'getValue'
        },
      }
    }
  },
  concat: {
    id: 'concat',
    fn: (vars, opts) => {
      return Array.isArray(opts.strings) ? opts.strings.join('') : opts.strings
    },
    optionFields: {
      strings: {
        type: 'text',
        multiple: true,
        default: '',
        tooltip: 'List of strings to concatenate',
      }
    }
  }
}

export class CMSFieldFunctionConfig {
  function:string = ''
  params:(string|number|boolean|null|CMSFieldFunctionConfig)[] = []
  constructor(conf?:CMSFieldFunctionConfig) {
    this.setFunction(conf?.function || '')
    this.params = conf?.params || []
  }
  get alias() {
    let aliases = {
      'getValue': '$values',
      'isError': '$errors',
      'isTouched': '$touched',
      'getFieldProperty': '$field',
    }
    let alias = aliases[this.function]
    if (alias) {
      if (!this.params[0] || this.params[0] === '$id') alias = alias.replace(/s$/,'');
      return alias
    }
    return this.function
  }
  setFunction(name:string) {
    if (name.match(/^values?$/)) this.function = 'getValue'
    else if (name.match(/^field$/)) this.function = 'getFieldProperty'
    else if (name.match(/^errors?$/)) this.function = 'isError'
    else if (name.match(/^touched$/)) this.function = 'isTouched'
    else this.function = name
  }
  push(param:string|number|boolean|null|CMSFieldFunctionConfig) {
    this.params.push(param)
  }
  toString() {
    let string = ""
    if (['getValue', 'isError', 'isTouched', 'getFieldProperty'].includes(this.function)) {
      if (!this.params[0] || this.params[0] === '$id') return this.alias
      else if (typeof this.params[0] === 'string') return `${this.alias}.${this.params[0]}`
    }
    else return `$${this.function}(${this.params.map(p => {
      if (p === null) return 'null'
      if (typeof p === 'string' && p.match(/[,"\(\)]/)) return `"${p.replace(/"/g, '""')}"`
      return p
    }).join(',')})`
  }
}

// Some changeless regexes
const valueRegex = /^\$(field|values?|errors?|touched)\b/
const propRegex = /^\.([a-zA-Z0-9\.\[\]]+)/ // TODO: evaluate allowed characters restrictions - could we just use [^\n\s\),]?
const endScriptRegex = /^[\n\s]*$/

export function parseFieldFunctionScript(config:any, functionNames:string[] = Object.keys(functions)):CMSFieldFunctionConfig|undefined {

  // PRE-FLIGHT
  if (!config) return

  // (note: no errors yet, as this function will be used to test if a string will parse as a script)
  // In case we are passed a valid config setting
  if (functionNames.includes(config?.['function']) && (!config?.['params'] || Array.isArray(config?.['params']))) {
    return new CMSFieldFunctionConfig(config)
  }

  // If it is not a string, exit
  if (typeof config !== 'string') return

  // Clone and trim the src string
  let src = config.trim()

  // If the string doesn't start with a $, exit
  if (!src.match(/^\$/)) return

  // Setup regex for functions
  let functionRegex = new RegExp(`^\\$(?:f(?:unctio)?ns?\\.)?(${functionNames.filter(k => k.match(/^[a-zA-Z]+$/) && !k.match(/(lists?)/)).join('|')})`)

  // If the string doesn't match a value or function, exit
  if (!src.match(valueRegex) && !src.match(functionRegex)) return

  // We are now confident that the text is supposed to be a script.
  // TODO: should we throw errors from this point? Maybe so, since we're so confident...

  // initialize variables
  let tail:string,
      i:number = 0,
      stack:CMSFieldFunctionConfig[] = [],
      match,
      textParam = '',
      parsing:string = 'base' // 'base'|'params'|'command'|'function'|'value'|'text'|'vars'|'endValue'|'endParams'

  // Loop through string
  while (tail = src.slice(i)) {

    // Check if the tail is ONLY empty space.
    // If so, the script is done and we can exit the loop.
    if (tail.match(/^[\s\n]+$/m)) break

    // Check that we always have something on the stack.
    // If we are past parsing 'base' and there is nothing on the stack
    // then the string is longer than the script, which is invalid.
    if (parsing !== 'base' && !stack.length) return

    // Now parse the next part of the string
    switch (parsing) {
      case 'params':

        // Empty space (if parsing is "params")
        // In params (or base) we can advance past the space, as space is irrelevant to scripts.
        match = tail.match(/^\s+/)
        if (match) {
          i += match[0].length
          continue
        }

        // Next Param (if parsing is "params")
        else if (tail[0] === ',') {
          // Set parsing and advance
          i++
        }

        // End Params (if parsing is "params")
        else if (tail[0] === ')') {
          // Check for end of script
          if (tail.match(/^\)[\n\s]*$/) && stack.length === 2) {
            let func = stack.pop()
            stack[stack.length-1].push(func)
            return stack[0]
          }

          // Set parsing and advance
          parsing = 'endParams'; i++
        }

        // Text (if parsing is "params")
        else if (tail[0] === '"') {
          // Initialize the text param
          textParam = ''
          // Set parsing and advance
          parsing = 'text'; i++
        }

        // Vars (if parsing is "params")
        // (boolean, number, text, null)
        else parsing = 'vars';

        // no break; as the following works for base or params
      case 'base':

        // Begin Command (if parsing is "base" or "params")
        if (tail[0] === '$') {
          // Initialize new CMSFieldFunctionConfig
          // deepcode ignore MissingArgument: <this works, and I don't understand what's missing>
          stack.push(new CMSFieldFunctionConfig)
          // Set parsing (but don't advance, as the $ is part of the command syntax)
          parsing = 'command'
        }

        break;
      case 'command':

        // Value (if parsing is "command")
        // Values have precedence over functions, and
        // no function may have one of the protected value names.
        match = tail.match(valueRegex)
        if (match) {
          // Set value function
          stack[stack.length-1].setFunction(match[1])
          // Set parsing and advance
          parsing = 'value'
          i += match[0].length
        }

        // Function (if parsing is "command")
        else {
          match = tail.match(functionRegex)
          if (match) {
            // Set function function
            stack[stack.length-1].setFunction(match[1])
            // Set parsing and advance
            parsing = 'function'
            i += match[0].length
          }

          else {
            throw new Error(`Script error: Function not found at ${tail}`)
          }

        }

        break;
      case 'value':

        // Property (if parsing is "value")
        match = tail.match(propRegex)
        if (match) {
          // Push the property as the param
          stack[stack.length-1].push(match[1])
          // Set parsing and advance
          i += match[0].length
        }

        // If someone uses e.g. $values.$id
        // This is not necessary, as $id is obtained by default
        else if (tail.match(/\.\$id\b/)) {
          i += 4
        }

        parsing = 'endValue'

        break;
      case 'endValue':

        // The getValue function must be added to the stack now,
        // because it could be the end of params

        // If there is only one item on the stack
        if (stack.length === 1) {
          // Return the function if it is a complete script
          if (tail.match(endScriptRegex)) return stack[0]
          // Otherwise it is invalid
          else return
        }

        // If this is a parameter, add it to the stack
        else if (tail.match(/^[\s]*(?:,|\)|\n)/)) {
          let func = stack.pop()
          stack[stack.length-1].push(func)
          // Set parsing
          parsing = 'params'
        }

        // If there is only one thing on the stack but there is more script,
        // then it is not a script.
        else return

        break;
      case 'function':

        // Begin Params (if parsing is "function")
        if (tail[0] === '(') {
          // Set parsing and advance
          parsing = 'params'; i++;
        }

        else parsing = 'endParams'

        break;
      case 'text':

        // Add escaped quotation marks (if parsing is "text")
        match = tail.match(/^""/)
        if (match) {
          // Add to textParam
          textParam += '"'
          // Parsing stays at "text", but advance
          i += 2
        }

        // End Text (if parsing is "text")
        else if (tail[0] === '"') {
          // Add textParam
          stack[stack.length-1].push(textParam)
          // Set parsing and advance
          parsing = 'params'; i++
        }

        // Continue Text (if parsing is "text")
        else {
          // Set textParam text
          match = tail.match(/^[^"]+/)
          textParam += match[0]
          // Set parsing and advance
          i += match[0].length
        }

        break;
      case 'vars':

        // Match specific values (boolean|null|int|float)
        match = tail.match(/^(null|true|false|\d+|\d+\.\d+)(?=,|\n|\)|$)/)
        if (match) {
          // Get the specific value
          let v = match[1]
          if (v === 'null') v = null
          else if (v === 'true') v = true
          else if (v === 'false') v = false
          else if (v.includes('.')) v = parseFloat(v)
          else v = parseInt(v)
          // Push the value to the last function on the stack
          stack[stack.length-1].push(v)
          // Set parsing and advance
          parsing = 'params'; i += match[0].length
        }

        else {
          // Get the parameter, which is treated as text
          match = tail.match(/^[^,\n\)]+/)
          // Push it to the last function on the stack
          stack[stack.length-1].push(match[0])
          // Set parsing and advance
          parsing = 'params'; i += match[0].length
        }

        break;
      case 'endParams':

        // End script (if it is blank AND the base of the script is a value)
        if (tail.match(endScriptRegex) && stack.length === 1) return stack[0]

        // TODO: figure out why this is going wrong in edge cases.
        // End Value or Param (if not at the top level)
        match = tail.match(/^\s*(?:\)|[,\n]+\)?)/)
        if (match && stack.length > 1) {
          let func = stack.pop()
          stack[stack.length-1].push(func)
          // Set parsing and advance
          parsing = 'params'; i += match[0].length
        }

        // This happens if there is extra text after a script or parameter,
        // e.g. "$now() ," or "$not($values.)"
        else return

        if (!tail.length || tail.match(/^[\n\s]+$/) && stack.length === 1) return stack[0]

        break;
      default:
        return
    }

  // End of loop (end of string)
  }

  // If we have a single valid function, return it
  if (stack.length === 1 && stack[0].function) return stack[0]

  // If we haven't returned something by now, it's not a script

}

export default functions