function set_cookie(param, value) {
    $.cookie(param, value, { expires: `{config.cookie.maxsave}`, path: '/' });
}

function get_cookie(param) {
    return $.cookie(param);
}