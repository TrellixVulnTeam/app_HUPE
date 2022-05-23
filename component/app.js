const { resourceLimits } = require("worker_threads");

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = class apps {
    constructor(app) {
        this.app = app;
    }
    openfile = (file) => {
        const fs = require("fs");
        return fs.readFileSync(global.config.dir.client + file, "utf8");
    }
    replaceAll = (html, element) => {
        var config = global.config;
        var el = element;
        element = element.toLowerCase().replace('{', '').replace('}', '').replaceAll('`', '').replaceAll(' ', '').trim();
        eval(`
        var els = ` + element + `;
        if ((els) && (els != 'undefined')){
        html = html.replaceAll('` + el + `', els);
        } else{
        html = html.replaceAll('` + el + `', '');    
        }`);
        return html;
    }
    compilefile = (html, rezim = '') => {
        if (rezim.toLowerCase() == 'js') {
            var matches = Array.from(new Set(html.match(/\`{(.*?)}`/gi)));
        } else
            var matches = Array.from(new Set(html.match(/{(.*?)}/gi)));

        for (var element of matches) {
            html = this.replaceAll(html, element);
        };
        if (rezim.toLowerCase() == 'js')
            html = '<script>' + html + '</script>';
        return html;
    }
    compile = (file, rezim = '') => {
        let html = this.openfile(file);
        html = this.compilefile(html, rezim);

        return html;
    }
    get = (file) => {
        let html = this.compile(file);
        this.app.get('/', (req, res) => {
            res.send(html);
        });
    }

};