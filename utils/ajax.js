export function request (url, options) {
    return fetch(url, options).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw Error('报错');
        }
    }).catch(error => {
        console.error(error)
    })
}