export function getList(items) {
    if (Array.isArray(items))
        return items.map(item => item.toString()).map(item => {
            let [value, label] = item.split(/\s*:\s*/, 2);
            return {
                value,
                label: label || value
            };
        });
    else if (items?.constructor === Object)
        return Object.entries(items).map(e => ({
            value: e[0],
            label: e[1].toString(),
        }));
    else
        return [];
}
