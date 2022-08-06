// import CMSWidgetMarkdown from './CMSWidgetMarkdown.svelte'
import MarkdownIT from 'markdown-it';
let md;
const pluginBuilder = (config) => {
    config = Object.assign({}, {
        commonmark: true,
    }, config);
    if (config.md)
        md = config.md;
    else {
        md = new MarkdownIT(config.commonmark ? 'commonmark' : 'default');
    }
    const plugin = {
        id: 'markdown',
        transformers: [
            {
                id: 'markdown',
                description: `Converts Markdown text to HTML using a Markdown processor (by default markdown-it).`,
                fn: (value) => {
                    return md.render(value);
                },
            }
        ],
        fieldTypes: [
            {
                id: 'markdown',
                default: '',
                widget: 'textarea',
                display: {
                    type: 'div',
                    html: true,
                },
                preMount: ['markdown'],
            },
        ],
        fieldWidgets: {
            markdown: ['textarea', 'calculated']
        },
    };
    return plugin;
};
export default pluginBuilder;
