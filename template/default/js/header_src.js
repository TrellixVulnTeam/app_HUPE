function set_cookie(param, value) {
    $.cookie(param, value, { expires: `{config.cookie.maxsave}`, path: '/' });
}

function get_cookie(param) {
    return $.cookie(param);
}

var url_foto = '`{config.url.foto}`';
var url_status = '`{config.url.status}`';
var session = '`{req.session.id}`';
var org_url = '`{req.url}`';