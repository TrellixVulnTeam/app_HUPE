const { resourceLimits } = require("worker_threads");
const path = require('path');
const fs = require("fs");

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = class apps {
    constructor(app) {
        this.app = app;
    }
    openfile = (file) => {
        return fs.readFileSync(global.config.dir.client + file, "utf8");
    }
    replaceAll = (html, element) => {
        var config = global.config;
        var row = global.row;
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
    compileCss = (file) => {
        var files = global.config.dir.client + file;
        var css = path.dirname(files) + '/' + path.basename(files).replace(path.extname(files), '.css');
        if (fs.existsSync(css)) {
            return `<link href="${global.config.template}${file.replace(path.extname(files), '.css')}" type="text/css" rel="stylesheet">`;
        } else {
            var css = path.dirname(files) + '/css/' + path.basename(files).replace(path.extname(files), '.css');
            if (fs.existsSync(css)) {
                return `<link href="${global.config.template}${'css/'+file.replace(path.extname(files), '.css')}" type="text/css" rel="stylesheet">`;
            }
        }
        return '';
    }
    compileJs = (file) => {
        var files = global.config.dir.client + file;
        var css = path.dirname(files) + '/' + path.basename(files).replace(path.extname(files), '.js');
        if (fs.existsSync(css)) {
            return `<script src="${global.config.template}${file.replace(path.extname(files), '.js')}">`;
        } else {
            var css = path.dirname(files) + '/js/' + path.basename(files).replace(path.extname(files), '.js');
            if (fs.existsSync(css)) {
                return `<script src="${global.config.template}${'js/'+file.replace(path.extname(files), '.js')}">`;
            }
        }
        return '';
    }
    compilefile = (html, rezim = '') => {

        var matches = Array.from(new Set(html.match(/`{(.*?)}`/gi)));

        for (var element of matches) {
            html = this.replaceAll(html, element);
        };
        if (rezim.toLowerCase() == 'js')
            html = '<script>' + html + '</script>';
        return html;
    }
    compile = (file, rezim = '', row = null) => {
        let html = this.openfile(file);
        if (rezim != 'js')
            html = this.compileCss(file) + html + this.compileJs(file);
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