function json_html(json) {
    var js = '';
    if (json.title)
        js += `$('title').text('${json.title}');`;
    if (json.url)
        js += `setUrls('${json.url}', 0, true);`;

    return '<script id="idscripteval">' + js + ';setTimeout(() => {$("#idscripteval").remove();}, 100);</script>';

}
module.exports = async function(data) {
    if (!data.url || data.url == '/') {
        var arr_url = ['', global.config.url.default];
    } else {
        var arr_url = data.url.split('/');
    }
    var html = data.html;

    const { window } = new global.jsdom('<body>' + html + '</body');
    var $ = require('jquery')(window);
    $('[href="/' + arr_url[1] + '"]').addClass('butactive');

    var arjson = null;
    const fs = require("fs");
    var jsonfile = global.config.prefiks + global.config.dir.modul + '/' + arr_url[1] + '/' + arr_url[1] + '.json';
    if (fs.existsSync(jsonfile)) {
        try {
            arjson = JSON.parse(fs.readFileSync(jsonfile, "utf8"));
        } catch (error) {}
        $('body').append(json_html(arjson));
    }

    const director = global.config.dir.clientmodul + arr_url[1] + '/';
    if (fs.existsSync(director)) {
        files = fs.readdirSync(director);
        for (file of files) {
            if (fs.lstatSync(director + file).isFile()) {
                var rhtml = fs.readFileSync(director + file, "utf8");
                var ids = file.replace('.html', '');
                $(`#${ids}`).html(rhtml);
                var filjs = global.config.dir.clientmodul + arr_url[1] + '/js/' + ids + '.js';
                if (fs.existsSync(filjs)) {
                    $(`#${ids}`).append('<script src="' + global.config.template + global.config.dir.modul + '/' + arr_url[1] + '/js/' + ids + '.js"></script>');
                }
                var filcss = global.config.dir.clientmodul + arr_url[1] + '/css/' + ids + '.css';
                if (fs.existsSync(filcss)) {
                    $(`#${ids}`).prepend('<link href="' + global.config.template + global.config.dir.modul + '/' + arr_url[1] + '/css/' + ids + '.css"  type="text/css" rel="stylesheet">');
                }
            }
        }
    }
    html = $('body').html();
    html = await global.aps.compilefile(html)
    return html;
}

module.exports.parser = async function(data) {
    var arr_url = data.url.split('/');
    var jsonfile = global.config.prefiks + global.config.dir.modul + '/' + arr_url[1] + '/' + arr_url[1] + '.json';
    const { window } = new global.jsdom('<body></body');
    const fs = require("fs");
    var $ = require('jquery')(window);
    if (fs.existsSync(jsonfile)) {
        try {
            arjson = JSON.parse(fs.readFileSync(jsonfile, "utf8"));
        } catch (error) {}

        global.function.get_io({
            add: {
                elem: 'body',
                html: await json_html(arjson),
            }
        })
    }
    const director = global.config.dir.clientmodul + arr_url[1] + '/';
    if (fs.existsSync(director)) {
        files = fs.readdirSync(director);
        for (file of files) {
            if (fs.lstatSync(director + file).isFile()) {
                var rhtml = fs.readFileSync(director + file, "utf8");
                var ids = file.replace('.html', '');
                var filjs = global.config.dir.clientmodul + arr_url[1] + '/js/' + ids + '.js';
                if (fs.existsSync(filjs)) {
                    rhtml += '<script src="' + global.config.template + global.config.dir.modul + '/' + arr_url[1] + '/js/' + ids + '.js"></script>';
                }
                var filcss = global.config.dir.clientmodul + arr_url[1] + '/css/' + ids + '.css';
                if (fs.existsSync(filcss)) {
                    rhtml = '<link href="' + global.config.template + global.config.dir.modul + '/' + arr_url[1] + '/css/' + ids + '.css"  type="text/css" rel="stylesheet">' + rhtml;
                }
                rhtml = await global.aps.compilefile(rhtml)
                global.function.get_io({
                    script: '$("#' + ids + '").html(`' + rhtml + '`);'
                })
            }
        }
    }
}