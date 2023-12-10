export function pad(num, length = 2) {
    return num.toString().padStart(length, '0');
}
export function formatTimezoneOffset(tzo) {
    let dif = tzo >= 0 ? '+' : '-';
    return dif + pad(Math.floor(Math.abs(tzo)) / 60) +
        ':' + pad(Math.abs(tzo) % 60);
}
