export function urlParse(url) {
    /* eslint-disable no-useless-escape */
    const urlObj = {
        protocol: /^(.+)\:\/\//,
        host: /\:\/\/(.+?)[\?\#\s\/]/,
        path: /\w(\/.*?)[\?\#\s]/,
        query: /\?(.+?)[\#\/\s]/,
        hash: /\#(\w+)\s$/,
    };

    function formatQuery(str) {
        return str.split('&').reduce((a, b) => {
            const arr = b.split('=');
            a[arr[0]] = arr[1];
            return a;
        }, {});
    }

    if (!url) {
        return {};
    }

    try {
        Object.keys(urlObj).forEach((key) => {
            const pattern = urlObj[key];

            if (key === 'query') {
                urlObj[key] = pattern.exec(url) && formatQuery(pattern.exec(url)[1]);
            } else {
                urlObj[key] = pattern.exec(url) && pattern.exec(url)[1];
            }
        });
    } catch (err) {
        console.log(err);
    }

    return urlObj;
}

export function getQueryValue(queryName) {
    let query = decodeURI(window.location.search.substring(1));

    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] === queryName) {
            return pair[1];
        }
    }
    return null;
}

export function getQueryString(val) {
    const reg = new RegExp(`(^|&)${val}=([^&]*)(&|$)`);
    const r = decodeURIComponent(window.location.search.substr(1)).match(reg);

    if (r !== null) {
        return unescape(r[2]);
    }

    return null;
}

export function addQueryParams(src = '', params = {}) {
    let paramsStr = '';
    let tSrc = src;

    Object.keys(params).forEach((key) => {
        paramsStr += `&${key}=${params[key]}`;
    });

    if (paramsStr === '') {
        return tSrc;
    } else {
        if (/\?/g.test(tSrc)) {
            tSrc += paramsStr;
        } else {
            tSrc += `?${paramsStr.substring(1)}`;
        }

        return tSrc;
    }
}

export function updateQueryStringParameter(uri, key, value) {
    if (!value) {
        return uri;
    }
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

export function updateQueryStringParameterToCurrentURL(key, value) {
    let newUrl = updateQueryStringParameter(window.location.href, key, value);
    window.history.replaceState({
        path: newUrl
    }, '', newUrl);
}

export function replaceQueryParams(url, arg, val) {
    let pattern = `${arg}=([^&]*)`;
    let replaceText = `${arg}=${val}`;
    let currUrl = '';

    if (url.match(pattern)) {
        /* eslint-disable no-eval */
        let tmp = `/(${arg}=)([^&]*)/gi`;
        currUrl = url.replace(eval(tmp), replaceText);
    } else {
        currUrl = url.includes('?') ? `${url}&${replaceText}` : `${url}?${replaceText}`;
    }

    return currUrl;
}

export function removeQueryParams(url, param) {
    let urlparts = url.split('?');
    if (urlparts.length >= 2) {
        let prefix = `${encodeURIComponent(param)}=`;
        let pars = urlparts[1].split(/[&;]/g);

        for (let i = pars.length; i-- > 0; ) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '');
    }
    return url;
}

export function search2obj(lsearch) {
    const search = (lsearch && lsearch.substr(1)) || '';

    if (!search) {
        return {};
    }

    const paramsList = search.split('&');
    const params = {};

    paramsList.forEach((i) => {
        if (!i) {
            return;
        }

        const p = i.split('=');
        if (p.length === 1) {
            params[p[0]] = '';
        } else {
            params[p[0]] = p[1];
        }
    });

    return params;
}

export const obj2search = (obj) => {
    const search = Object.keys(obj)
        .map((i) => `${i}=${obj[i]}`)
        .join('&');

    if (!search) {
        return '';
    }

    return `?${search}`;
};

export const getUrlWithSearchObj = (obj) => {
    const params = search2obj(window.location.search);
    Object.assign(params, obj);

    return `${window.location.origin}${window.location.pathname}${obj2search(params)}`;
};

export function urlEncodeBase64(val) {
    return window.btoa(unescape(encodeURIComponent(val)));
}

export function urlDecodeBase64(val) {
    return decodeURIComponent(escape(window.atob(val)));
}

export function fomatPath(path) {
    if (!path) {
        return '/404';
    } else if (path.indexOf('//') >= -1) {
        return path;
    }
    return path.indexOf('/') === 0 ? path : `/${path}`;
}

export function getUrl(path) {
    if (!path) {
        return '/404';
    }

    if (path.indexOf('://') > -1) {
        return path;
    } else {
        return `${window.location.origin}${fomatPath(path)}`;
    }
}
export function isRouteExist(route) {
    if (route) {
        const pathname = window.location.pathname;
        return pathname.includes(route);
    }
    return false;
}
