import type { CMSPlugin } from "sveltecms/core/Plugin";

const nums = (num)=>(typeof num === 'number' ? num : Number(num))

export const mathPlugin:CMSPlugin = {
  id: 'math',
  scriptFunctions: [
    {
      id: 'mathAdd',
      fn: (vars, opts) => {
        const f = (a,b)=>a+b
        return opts.numbers.map(nums).reduce(f)
      },
      optionFields: {
        numbers: {
          type: 'number',
          multiple: true,
          default: undefined,
          helptext: 'First number to add.'
        },
      }
    },
    {
      id: 'mathSubtract',
      fn: (vars, opts) => {
        const f = (a,b)=>a-b
        return opts.numbers.map(nums).reduce(f)
      },
      optionFields: {
        numbers: {
          type: 'number',
          multiple: true,
          default: undefined,
          helptext: 'A list of numbers to subtract, consecutively, from the first number in the list.'
        }
      }
    },
    {
      id: 'mathMultiply',
      fn: (vars, opts) => {
        const f = (a,b)=>a*b
        return opts.numbers.map(nums).reduce(f)
      },
      optionFields: {
        numbers: {
          type: 'number',
          multiple: true,
          default: undefined,
          helptext: 'A list of numbers to multiply together.'
        }
      }
    },
    {
      id: 'mathDivide',
      fn: (vars, opts) => {
        const f = (a,b)=>a/b
        return opts.numbers.map(nums).reduce(f)
      },
      optionFields: {
        numbers: {
          type: 'number',
          multiple: true,
          default: undefined,
          helptext: 'Divide the first number by the second number, then the result by the third, etc.'
        }
      }
    },
  ]
}

export default mathPlugin