import MarkdownIT from 'markdown-it'
import MarkdownAttrs from 'markdown-it-attrs'
import MarkdownFootnotes from 'markdown-it-footnote'

const md = new MarkdownIT({
  html:true,
  linkify:true,
  typographer:true,
})
.use(MarkdownAttrs, {
  allowedAttributes: ['id','class']
})
.use(MarkdownFootnotes)

md.core.ruler.after('inline', 'checkboxes', state => {
  let tokens = state.tokens
  for (let i=2; i<tokens.length; i++) {
    let t = tokens[i]
    if (
      tokens[i].type === 'inline' &&
      tokens[i-1].type === 'paragraph_open' &&
      tokens[i-2].type === 'list_item_open'
    ) {
      let [,str,char] = (tokens[i].content.match(/^(\[( |x|X|-|\?|\*)?\])/) || [])
      if (str) {
        // this is a checkbox
        if (char === 'x' || char === 'X') tokens[i-2].attrPush(['class', 'checkbox checked'])
        else if (char === '-' || char === '?') tokens[i-2].attrPush(['class', 'checkbox indeterminate'])
        else tokens[i-2].attrPush(['class', 'checkbox'])
        tokens[i].children[0].content = tokens[i].children[0].content.slice(str.length)
        tokens[i].content = tokens[i].content.slice(str.length)
      }
    }
  }
})


export default md