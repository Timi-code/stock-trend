export function transformData(data, unity) {
    const result = [];
    _.uniqWith(data, (a, b) => _.isEqual(a.time, b.time)).forEach(item => {
        const date = item.time.slice(11, 19)
        result.push([date, Math.ceil(item.money / unity)])
    })
    return result;
}