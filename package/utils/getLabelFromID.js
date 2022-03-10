export default function getLabelFromID(id) {
    let l = id.replace(/.+\[/, '').replace('\]', '');
    let firstLetter = l.slice(0, 1).toUpperCase();
    return l.replace(/[A-Z]/g, ' $&').replace(/^./, firstLetter);
}
