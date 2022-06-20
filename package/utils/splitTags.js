export default function SplitTags(delimiter = ',', allowSpacesInItems = true) {
    const regexText = allowSpacesInItems ? `\\s*${delimiter}\\s*` : `(?:\\s|${delimiter})+`;
    const regex = new RegExp(regexText, 'g');
    return function splitTags(text) {
        return text?.split(regex);
    };
}
