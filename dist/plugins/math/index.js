const nums = (num) => (typeof num === 'number' ? num : Number(num));
export const mathPlugin = {
    id: 'math',
    scriptFunctions: [
        {
            id: 'mathAdd',
            description: 'Adds two or more numbers together.',
            fn: (vars, opts) => {
                const f = (a, b) => a + b;
                return opts.numbers.map(nums).reduce(f);
            },
            optionFields: {
                numbers: {
                    type: 'number',
                    multiple: true,
                    default: undefined,
                    helptext: 'A list of two or more numbers.'
                },
            }
        },
        {
            id: 'mathSubtract',
            description: 'Subtracts the second number from the first number, then the third from the result, etc.',
            fn: (vars, opts) => {
                const f = (a, b) => a - b;
                return opts.numbers.map(nums).reduce(f);
            },
            optionFields: {
                numbers: {
                    type: 'number',
                    multiple: true,
                    default: undefined,
                    helptext: 'A list of two or more numbers.'
                }
            }
        },
        {
            id: 'mathMultiply',
            description: 'Multiplies two or more numbers together.',
            fn: (vars, opts) => {
                const f = (a, b) => a * b;
                return opts.numbers.map(nums).reduce(f);
            },
            optionFields: {
                numbers: {
                    type: 'number',
                    multiple: true,
                    default: undefined,
                    helptext: 'A list of two or more numbers.'
                }
            }
        },
        {
            id: 'mathDivide',
            description: 'Divides the first number by the second, then the result by the third, etc.',
            fn: (vars, opts) => {
                const f = (a, b) => a / b;
                return opts.numbers.map(nums).reduce(f);
            },
            optionFields: {
                numbers: {
                    type: 'number',
                    multiple: true,
                    default: undefined,
                    helptext: 'A list of two or more numbers.'
                }
            }
        },
    ]
};
export default mathPlugin;
