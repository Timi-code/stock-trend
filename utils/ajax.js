export function request(url, options) {
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

export function ajax(type = 'get', url, data) {
    let config = {
        url: url,
        method: type,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    if (type === 'post') {
        config['body'] = JSON.stringify(data);
    }
    else if (type === 'get') {
        let ret = '?';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        ret = ret.substring(0, ret.length - 1);
        config.url += ret;
    }
    return rxjs.ajax.ajax(config);
}