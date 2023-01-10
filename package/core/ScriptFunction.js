import { get, has, isEqual, set, cloneDeep } from 'lodash-es';
export const templateScriptFunction = {
    id: 'scriptFunction',
    label: 'Script Function',
    labelPlural: 'Script Functions',
    description: 'Script Functions provide dynamic values for some properties and options'
        + ' of Fields and Widgets when editing and saving content, allowing for conditional and'
        + ' calculated fields, for example.',
    typeField: false,
    isConfigurable: true,
};
function getFullPath(path, id) {
    if (!path)
        return id;
    if (!id)
        return path;
    return `${path}.${id}`;
}
export class ScriptFunction {
    constructor(conf, vars, cms) {
        if (typeof conf === 'string')
            conf = parseScript(conf); // this should be rare, but just in case...
        let func = cms.scriptFunctions[conf.function];
        if (!func)
            throw `Script function not found for ${conf}`; // this will also happen if the config is bad
        this.id = func.id;
        this.vars = { ...vars, cms };
        this.fn = func.fn;
        // @ts-ignore
        this.options = cms.getConfigOptionsFromFields(func?.optionFields || {});
        if (Array.isArray(conf.params)) {
            let params = cloneDeep(conf.params);
            let lastKey;
            Object.keys(func?.optionFields || {}).forEach((k, i) => {
                // @ts-ignore
                if (params.length)
                    this.options[k] = params.shift();
                lastKey = k;
            });
            // for functions where the last param is an array
            if (func?.optionFields?.[lastKey]?.multiple) {
                // @ts-ignore
                if (!Array.isArray(this.options[lastKey]))
                    this.options[lastKey] = [this.options[lastKey]];
                while (params.length) {
                    // @ts-ignore
                    this.options[lastKey].push(params.shift());
                }
            }
        }
        // }
        cms.initializeConfigOptions(this.options, vars);
    }
    run() {
        this.fn(this.vars, this.options);
    }
}
export class ScriptError extends Error {
    constructor(message, state, tail) {
        super(message);
        this.state = state;
        this.tail = tail || '';
        return this;
    }
}
export class ScriptFunctionConfig {
    constructor(conf) {
        this.function = '';
        this.params = [];
        this.setFunction(conf?.function || '');
        this.params = conf?.params || [];
    }
    get alias() {
        let aliases = {
            'getValue': '$values',
            'isError': '$errors',
            'isTouched': '$touched',
            'getProperty': '$props',
        };
        let alias = aliases[this.function];
        if (alias) {
            if (!this.params[0] || this.params[0] === '$id')
                alias = alias.replace(/s$/, '');
            return alias;
        }
        return this.function;
    }
    setFunction(name) {
        if (name.match(/^values?$/))
            this.function = 'getValue';
        else if (name.match(/^props?$/))
            this.function = 'getProperty';
        else if (name.match(/^errors?$/))
            this.function = 'isError';
        else if (name.match(/^touched$/))
            this.function = 'isTouched';
        else
            this.function = name;
    }
    push(param) {
        this.params.push(param);
    }
    toString() {
        let string = "";
        if (['getValue', 'isError', 'isTouched', 'getProperty'].includes(this.function)) {
            if (!this.params[0] || this.params[0] === '$id')
                return this.alias;
            else if (typeof this.params[0] === 'string')
                return `${this.alias}.${this.params[0]}`;
        }
        else
            return `$${this.function}(${this.params.map(p => {
                if (p === null)
                    return 'null';
                if (typeof p === 'string' && p.match(/[,"\(\)]/))
                    return `"${p.replace(/"/g, '""')}"`;
                return p;
            }).join(',')})`;
    }
}
export const scriptFunctions = {
    now: {
        id: 'now',
        description: 'Returns the current date.',
        fn: () => {
            return new Date();
        }
    },
    contains: {
        id: 'contains',
        description: 'Determines whether string or array contains a particular value.',
        fn: (vars, opts) => {
            return opts.textOrArray?.includes(opts.searchFor);
        },
        optionFields: {
            textOrArray: {
                type: 'text',
                default: '',
                helptext: 'A string or array which may or may not contain the value.'
            },
            searchFor: {
                type: 'text',
                default: '',
                helptext: 'The value for which to test.'
            },
        }
    },
    once: {
        id: 'once',
        description: 'Runs a function once only, when the form is first loaded.',
        fn: (vars, opts) => {
            return opts.function;
        },
        optionFields: {
            function: {
                type: 'text',
                default: null,
                helptext: 'A function to run once.'
            }
        }
    },
    transform: {
        id: 'transform',
        description: 'Runs a Transformer function on a value. Note that the Transformer options cannot be set on this Function'
            + '; if the defaults must be overridden, then a new Transformer should be created of the type desired.',
        fn: (vars, opts) => {
            return vars.cms.transform(opts.value, opts.transformer);
        },
        optionFields: {
            value: {
                type: 'text',
                default: {
                    function: 'getValue'
                },
                helptext: 'The value to be transformed.',
            },
            transformer: {
                type: 'text',
                default: null,
                helptext: 'The ID of the transformer to run.'
            },
        }
    },
    getProperty: {
        id: 'getProperty',
        description: 'Gets a single property from the Entity being configured. Shortname: "$prop" or "$props.[PropertyName]".',
        fn: (vars, opts) => {
            return get(vars.field, opts.property);
        },
        optionFields: {
            property: {
                type: 'text',
                default: '',
                helptext: 'The name of the property to get.'
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
    setProperty: {
        id: 'setProperty',
        description: 'Sets a single property on the Entity being configured.',
        fn: (vars, opts) => {
            vars.field[opts.property] = opts.value;
        },
        optionFields: {
            property: {
                type: 'text',
                default: '',
                helptext: 'The name of the field property to set.',
            },
            value: {
                type: 'text',
                default: '',
                helptext: 'The value to set.'
            },
        }
    },
    id: {
        id: 'id',
        description: 'Gets the ID of the Entity being configured. Shortname: "$id".',
        fn: (vars, opts) => {
            return opts.id || '';
        }
    },
    getValue: {
        id: 'getValue',
        description: 'Gets the value of a field from the form being submitted. Shortname: "$value" or "$values.[FieldID]"',
        fn: (vars, opts) => {
            let path = getFullPath(vars.id, opts.fieldID);
            if (has(vars.values, path))
                return get(vars.values, path);
            return get(vars.values, opts.fieldID);
        },
        optionFields: {
            fieldID: {
                type: 'text',
                helptext: 'The name of the item field to get. Defaults to the current field, so "$value" === "$values($id)".',
                default: {
                    function: 'id',
                },
            }
        }
    },
    setValue: {
        id: 'setValue',
        description: 'Sets the value of a field.',
        fn: (vars, opts) => {
            let path = getFullPath(vars.id, opts.fieldID);
            if (has(vars.values, path))
                set(vars.values, path, opts.value);
            else
                set(vars.values, opts.fieldID, opts.value);
        },
        optionFields: {
            fieldID: {
                type: 'text',
                helptext: 'The name of the item field which should be set to a value.',
                default: {
                    function: 'id',
                }
            },
            value: {
                type: 'text',
                helptext: 'The value to set.',
                default: '',
            }
        }
    },
    isError: {
        id: 'isError',
        description: 'Determines whether a field has an error. Shortname: "$errors" or "$errors.[FieldID]". UNUSED AS YET: requires validators.',
        fn: (vars, opts) => {
            let path = getFullPath(vars.id, opts.fieldID);
            if (has(vars.errors, path))
                return get(vars.errors, path);
            return get(vars.errors, opts.fieldID);
        },
        optionFields: {
            fieldID: {
                type: 'text',
                helptext: 'The name of the item field to check for errors.',
                default: {
                    function: 'id'
                },
            }
        }
    },
    isTouched: {
        id: 'isTouched',
        description: 'Determines whether a field has been touched. Shortname: "$touched" or "$touched.[FieldID]".',
        fn: (vars, opts) => {
            let path = getFullPath(vars.id, opts.fieldID);
            if (has(vars.touched, path))
                return get(vars.touched, path);
            return get(vars.touched, opts.fieldID);
        },
        optionFields: {
            fieldID: {
                type: 'text',
                helptext: 'The name of the item field to check if it was touched.',
                default: {
                    function: 'id'
                },
            }
        }
    },
    not: {
        id: 'not',
        description: 'Negates the value of the provided parameter.',
        fn: (vars, opts) => {
            return !opts.value;
        },
        optionFields: {
            value: {
                type: 'text',
                helptext: 'The value to be tested for "truthiness"--returns true for: false, 0, null, undefined, and empty strings.',
                default: {
                    function: 'getValue'
                },
            }
        }
    },
    if: {
        id: 'if',
        description: 'A conditional or ternary operator, with the condition to be tested first,'
            + ' followed by the value if true and then the value if false.',
        fn: (vars, opts) => {
            return opts.condition ? opts.ifTrue : opts.ifFalse;
        },
        optionFields: {
            condition: {
                type: 'text',
                helptext: '',
                default: 'The condition to be tested.',
            },
            ifTrue: {
                type: 'text',
                helptext: 'The function to run or value to return if true.',
                default: true,
            },
            ifFalse: {
                type: 'text',
                helptext: 'The function to run or value to return if false.',
                default: false,
            }
        }
    },
    or: {
        id: 'or',
        description: 'Tests if any of the parameters are truthy.',
        fn: (vars, opts) => {
            let passed = Object.keys(opts.conditions).filter(k => Boolean(opts[k]));
            return passed.length > 0;
        },
        optionFields: {
            conditions: {
                type: 'text',
                helptext: 'The conditions or values to be tested for truthiness.',
                multiple: true,
                default: [],
            }
        }
    },
    and: {
        id: 'and',
        description: 'Tests if all of the parameters are truthy.',
        fn: (vars, opts) => {
            let passed = Object.keys(opts.conditions).filter(k => Boolean(opts[k]));
            return passed.length > 0;
        },
        optionFields: {
            conditions: {
                type: 'text',
                helptext: 'The conditions or values to be tested for truthiness.',
                multiple: true,
                default: [],
            }
        }
    },
    equal: {
        id: 'equal',
        description: 'Tests if all of the parameters are equal. Should work with arrays.',
        fn: (vars, opts) => {
            const number = Object.keys(opts.values).length;
            if (number < 2)
                return false;
            const value = opts.values[0];
            let conditions = Object.keys(opts.values).filter(k => isEqual(value, opts.values[k]));
            return (conditions.length === number);
        },
        optionFields: {
            values: {
                type: 'text',
                helptext: 'The values to be tested for equality, using isEqual from lodash.',
                multiple: true,
                default: [],
            }
        }
    },
    isLessThan: {
        id: 'isLessThan',
        description: 'Tests whether one value is less than another. Also supports less than or equal.',
        fn: (vars, opts) => {
            return opts.orEqual ? opts.value <= opts.isLessThan : opts.value < opts.isLessThan;
        },
        optionFields: {
            value: {
                type: 'text',
                helptext: 'The base value.',
                default: '',
            },
            isLessThan: {
                type: 'text',
                helptext: 'The test value. Returns true if test value is less than the base value.',
                default: '',
            },
            orEqual: {
                type: 'boolean',
                helptext: 'If true, returns true if the test value is equal to the base value.',
                default: false,
            }
        }
    },
    isGreaterThan: {
        id: 'isGreaterThan',
        description: 'Tests whether one value is greater than another. Also supports greater than or equal.',
        fn: (vars, opts) => {
            return opts.orEqual ? opts.value >= opts.isGreaterThan : opts.value > opts.isGreaterThan;
        },
        optionFields: {
            value: {
                type: 'text',
                helptext: 'The base value.',
                default: '',
            },
            isGreaterThan: {
                type: 'text',
                helptext: 'The test value. Returns true if test value is greater than the base value.',
                default: '',
            },
            orEqual: {
                type: 'boolean',
                helptext: 'If true, returns true if the test value is equal to the base value.',
                default: false,
            }
        }
    },
    isNull: {
        id: 'isNull',
        description: 'Tests whether a value is the "null" value.',
        fn: (vars, opts) => {
            return (opts?.value === undefined || opts?.value === null);
        },
        optionFields: {
            value: {
                type: 'text',
                helptext: 'The test value. Returns true if test value is null or undefined.',
                default: {
                    function: 'getValue'
                },
            }
        }
    },
    concat: {
        id: 'concat',
        description: 'Concatenates several strings into a single string. Shorthand for join("",[...values]).',
        fn: (vars, opts) => {
            return Array.isArray(opts.strings) ? opts.strings.join('') : opts.strings;
        },
        optionFields: {
            strings: {
                type: 'text',
                multiple: true,
                default: '',
                helptext: 'List of strings to concatenate.',
            }
        }
    },
    join: {
        id: 'join',
        description: 'Joins several values into a string using a particular join string.',
        fn: (vars, opts) => {
            return Array.isArray(opts.values) ? opts.values.join(opts.joinString) : opts.values;
        },
        optionFields: {
            joinString: {
                type: 'text',
                default: ' ',
                helptext: 'The string of characters used to join the provided values.'
            },
            values: {
                type: 'text',
                multiple: true,
                default: '',
                helptext: 'List of strings to join with the join string.'
            }
        }
    },
    length: {
        id: 'length',
        description: 'Gets the length of a string or array.',
        fn: (vars, opts) => {
            return opts?.value?.length || 0;
        },
        optionFields: {
            value: {
                type: 'text',
                default: '',
                helptext: 'A string or array for which to get the number of characters or items.'
            }
        }
    },
    typeof: {
        id: 'typeof',
        description: 'Gets the variable type of a value, or tests that a value matches a particular type.',
        fn: (vars, opts) => {
            return (typeof opts?.value === opts?.type) ? opts.type : (opts.type ? false : typeof opts?.value);
        },
        optionFields: {
            value: {
                type: 'text',
                default: '',
                helptext: 'A value of which to get the type. Generally only useful with a script function.'
            },
            type: {
                type: 'text',
                default: '',
                helptext: 'The type that the value should be in order to pass this test.'
            },
        }
    },
    listEntities: {
        id: 'listEntities',
        description: 'Lists the registered Entities of a partuclar type.',
        admin: true,
        fn: (vars, opts) => {
            return vars.cms.listEntities(opts.entityType, opts.includeAdmin);
        },
        optionFields: {
            entityType: {
                type: 'text',
                default: 'fields',
                helptext: 'The type of entity to list',
            },
            includeAdmin: {
                type: 'boolean',
                default: 'fields',
                helptext: 'Whether to include entities tagged as admin',
            },
        }
    },
    slugFields: {
        id: 'slugFields',
        description: 'Lists slug fields for a Content Type, or generic Fields that are required and indexed.'
            + ' Used to populate options for Reference widgets.',
        admin: true,
        fn: (vars, opts) => {
            if (!opts.entityType || !opts.entityID)
                return vars.cms.listEntities('fields').filter(id => (vars?.cms?.fields?.[id]?.index && vars?.cms?.fields?.[id]?.required));
            let contentType = vars.cms?.contentTypes?.[opts.contentTypeID];
            if (!contentType)
                return vars.cms.listEntities('fields').filter(id => (vars?.cms?.fields?.[id]?.index && vars?.cms?.fields?.[id]?.required));
            return contentType.slug.fields;
        },
        optionFields: {
            contentTypeID: {
                type: 'text',
                default: '',
                helptext: 'The ID of the Content Type.'
            },
        }
    },
    widgetHandles: {
        id: 'widgetHandles',
        description: 'Whether the widget handles fields, media, or multiple values.',
        admin: true,
        fn: (vars, opts) => {
            if (!vars.values?.widget)
                return false;
            let widgetRoot = vars.cms.getEntityRoot('widgets', vars.values.widget?.type ?? vars.values.widget);
            switch (opts.handlesWhat) {
                case 'fields': return widgetRoot.handlesFields;
                case 'media': return widgetRoot.handlesMedia;
                case 'multiple': return widgetRoot.handlesMultiple;
            }
        },
        optionFields: {
            handlesWhat: {
                type: 'text',
                default: 'fields',
                helptext: 'What to check the widget for handling',
                widget: {
                    type: 'select',
                    items: ['fields', 'media', 'multiple']
                }
            }
        }
    },
    debug: {
        id: 'debug',
        description: 'Logs the value of the parameter to the console.',
        fn: (vars, opts) => {
            console.log({ returnValue: opts.value, ...vars });
            return opts.value;
        },
        optionFields: {
            value: {
                type: 'text',
                default: '',
                helptext: 'The value to return after debugging.'
            }
        }
    }
};
// Some changeless regexes
const valueRegex = /^\$(props?|values?|errors?|touched)\b/;
const propRegex = /^\.([a-zA-Z0-9\.\[\]]+)/; // TODO: evaluate allowed characters restrictions - could we just use [^\n\s\),]?
const endScriptRegex = /^[\n\s]*$/;
export function parseScript(config, functionNames = Object.keys(scriptFunctions)) {
    // PRE-FLIGHT
    if (!config)
        return;
    // (note: no errors yet, as this function will be used to test if a string will parse as a script)
    // In case we are passed a valid config setting
    if (functionNames.includes(config?.['function']) && (!config?.['params'] || Array.isArray(config?.['params']))) {
        return new ScriptFunctionConfig(config);
    }
    // If it is not a string, exit
    if (typeof config !== 'string')
        return;
    // Clone and trim the src string
    let src = config.trim();
    // If the string doesn't start with a $, exit
    if (!src.match(/^\$/))
        return;
    // Setup regex for functions
    let functionRegex = new RegExp(`^\\$(?:f(?:unctio)?ns?\\.)?(${functionNames.filter(k => k.match(/^[a-zA-Z]+$/) && !k.match(/(lists?)/)).join('|')})`);
    // If the string doesn't match a value or function, exit
    if (!src.match(valueRegex) && !src.match(functionRegex))
        return;
    // We are now confident that the text is supposed to be a script.
    // TODO: should we throw errors from this point? Maybe so, since we're so confident...
    // initialize variables
    let tail, i = 0, stack = [], match, textParam = '', parsing = 'base'; // 'base'|'params'|'command'|'function'|'value'|'text'|'vars'|'endValue'|'endParams'
    // Loop through string
    while (tail = src.slice(i)) {
        // Check if the tail is ONLY empty space.
        // If so, the script is done and we can exit the loop.
        if (tail.match(/^[\s\n]+$/m))
            break;
        // Check that we always have something on the stack.
        // If we are past parsing 'base' and there is nothing on the stack
        // then the string is longer than the script, which is invalid.
        if (parsing !== 'base' && !stack.length)
            return;
        // Now parse the next part of the string
        switch (parsing) {
            case 'params':
                // Empty space (if parsing is "params")
                // In params (or base) we can advance past the space, as space is irrelevant to scripts.
                match = tail.match(/^\s+/);
                if (match) {
                    i += match[0].length;
                    continue;
                }
                // Next Param (if parsing is "params")
                else if (tail[0] === ',') {
                    // Set parsing and advance
                    i++;
                }
                // End Params (if parsing is "params")
                else if (tail[0] === ')') {
                    // Check for end of script
                    if (tail.match(/^\)[\n\s]*$/) && stack.length === 2) {
                        let func = stack.pop();
                        stack[stack.length - 1].push(func);
                        return stack[0];
                    }
                    // Set parsing and advance
                    parsing = 'endParams';
                    i++;
                }
                // Text (if parsing is "params")
                else if (tail[0] === '"') {
                    // Initialize the text param
                    textParam = '';
                    // Set parsing and advance
                    parsing = 'text';
                    i++;
                }
                // Vars (if parsing is "params")
                // (boolean, number, text, null)
                else
                    parsing = 'vars';
            // no break; as the following works for base or params
            case 'base':
                // Begin Command (if parsing is "base" or "params")
                if (tail[0] === '$') {
                    // Initialize new CMSScriptFunctionConfig
                    // deepcode ignore MissingArgument: <this works, and I don't understand what's missing>
                    stack.push(new ScriptFunctionConfig);
                    // Set parsing (but don't advance, as the $ is part of the command syntax)
                    parsing = 'command';
                }
                break;
            case 'command':
                // Value (if parsing is "command")
                // Values have precedence over functions, and
                // no function may have one of the protected value names.
                match = tail.match(valueRegex);
                if (match) {
                    // Set value function
                    stack[stack.length - 1].setFunction(match[1]);
                    // Set parsing and advance
                    parsing = 'value';
                    i += match[0].length;
                }
                // Function (if parsing is "command")
                else {
                    match = tail.match(functionRegex);
                    if (match) {
                        // Set function function
                        stack[stack.length - 1].setFunction(match[1]);
                        // Set parsing and advance
                        parsing = 'function';
                        i += match[0].length;
                    }
                    else {
                        throw new ScriptError(`Script error: Function not found at ${tail}`, parsing, tail);
                    }
                }
                break;
            case 'value':
                // Property (if parsing is "value")
                match = tail.match(propRegex);
                if (match) {
                    // Push the property as the param
                    stack[stack.length - 1].push(match[1]);
                    // Set parsing and advance
                    i += match[0].length;
                }
                // If someone uses e.g. $values.$id
                // This is not necessary, as $id is obtained by default
                else if (tail.match(/\.\$id\b/)) {
                    i += 4;
                }
                parsing = 'endValue';
                break;
            case 'endValue':
                // The getValue function must be added to the stack now,
                // because it could be the end of params
                // If there is only one item on the stack
                if (stack.length === 1) {
                    // Return the function if it is a complete script
                    if (tail.match(endScriptRegex))
                        return stack[0];
                    // Otherwise it is invalid
                    else
                        return;
                }
                // If this is a parameter, add it to the stack
                else if (tail.match(/^[\s]*(?:,|\)|\n)/)) {
                    let func = stack.pop();
                    stack[stack.length - 1].push(func);
                    // Set parsing
                    parsing = 'params';
                }
                // If there is only one thing on the stack but there is more script,
                // then it is not a script.
                else
                    return;
                break;
            case 'function':
                // Begin Params (if parsing is "function")
                if (tail[0] === '(') {
                    // Set parsing and advance
                    parsing = 'params';
                    i++;
                }
                else
                    parsing = 'endParams';
                break;
            case 'text':
                // Add escaped quotation marks (if parsing is "text")
                match = tail.match(/^""/);
                if (match) {
                    // Add to textParam
                    textParam += '"';
                    // Parsing stays at "text", but advance
                    i += 2;
                }
                // End Text (if parsing is "text")
                else if (tail[0] === '"') {
                    // Add textParam
                    stack[stack.length - 1].push(textParam);
                    // Set parsing and advance
                    parsing = 'params';
                    i++;
                }
                // Continue Text (if parsing is "text")
                else {
                    // Set textParam text
                    match = tail.match(/^[^"]+/);
                    textParam += match[0];
                    // Set parsing and advance
                    i += match[0].length;
                }
                break;
            case 'vars':
                // Match specific values (boolean|null|int|float)
                match = tail.match(/^(null|true|false|\d+|\d+\.\d+)(?=,|\n|\)|$)/);
                if (match) {
                    // Get the specific value
                    let v = match[1];
                    if (v === 'null')
                        v = null;
                    else if (v === 'true')
                        v = true;
                    else if (v === 'false')
                        v = false;
                    else if (v.includes('.'))
                        v = parseFloat(v);
                    else
                        v = parseInt(v);
                    // Push the value to the last function on the stack
                    stack[stack.length - 1].push(v);
                    // Set parsing and advance
                    parsing = 'params';
                    i += match[0].length;
                }
                else {
                    // Get the parameter, which is treated as text
                    match = tail.match(/^[^,\n\)]+/);
                    // Push it to the last function on the stack
                    stack[stack.length - 1].push(match[0]);
                    // Set parsing and advance
                    parsing = 'params';
                    i += match[0].length;
                }
                break;
            case 'endParams':
                // End script (if it is blank AND the base of the script is a value)
                if (tail.match(endScriptRegex) && stack.length === 1)
                    return stack[0];
                // TODO: figure out why this is going wrong in edge cases.
                // End Value or Param (if not at the top level)
                match = tail.match(/^\s*(?:\)|[,\n]+\)?)/);
                if (match && stack.length > 1) {
                    let func = stack.pop();
                    stack[stack.length - 1].push(func);
                    // Set parsing and advance
                    parsing = 'params';
                    i += match[0].length;
                }
                // This happens if there is extra text after a script or parameter,
                // e.g. "$now() ," or "$not($values.)"
                else
                    return;
                if (!tail.length || tail.match(/^[\n\s]+$/) && stack.length === 1)
                    return stack[0];
                break;
            default:
                return;
        }
        // End of loop (end of string)
    }
    // If we have a single valid function, return it
    if (stack.length === 1 && stack[0].function)
        return stack[0];
    // If we haven't returned something by now, it's not a script
}
export default ScriptFunction;
