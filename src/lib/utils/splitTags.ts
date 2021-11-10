export default function SplitTags(delimiter = ',', allowSpace = true) {
  const regexText = allowSpace ? `\s*${delimiter}\s*` : `(?:\s|${delimiter})+`
  const regex = new RegExp(regexText, 'g')
  return function splitTags(text) {
    return text.split(regex)
  }
}
