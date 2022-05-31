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
    replaceAll = (html, element, req) => {
        var config = global.config;
        var row = global.row;
        var login = global.login;
        var rowin = global.rowin;
        var data = global.data;
        var el = element;
        element = element.toLowerCase().replace('`{', '').replace('}`', '').trim(); //.replaceAll('`', '').replaceAll(' ', '')
        eval(`
        try{
        var els = ${element};
        }catch(err){
            console.log(err);
            els = null;
        }
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
                return `<link href="${global.config.template}${path.dirname(file)}/css/${path.basename(files).replace(path.extname(files), '.css')}" type="text/css" rel="stylesheet">`;
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
                return `<script src="${global.config.template}${path.dirname(file)}/js/${path.basename(files).replace(path.extname(files), '.js')}"></script>`;
            }
        }
        return '';
    }
    compilefile = (html, rezim = '', data) => {

        var matches = Array.from(new Set(html.match(/`{(.*?)}`/gi)));

        for (var element of matches) {
            html = this.replaceAll(html, element, data);
        };
        if (rezim.toLowerCase() == 'js')
            html = '<script>' + html + '</script>';
        return html;
    }
    compile = (file, rezim = '', data) => {
        let html = this.openfile(file);
        if (rezim != 'js')
            html = this.compileCss(file) + html + this.compileJs(file);

        html = this.compilefile(html, rezim, data);

        return html;
    }
    compilesync = async(file, row, rezim = '') => {
        var html = await this.openfile(file);
        if (rezim != 'js')
            html = this.compileCss(file) + html + this.compileJs(file);
        var matches = Array.from(new Set(html.match(/`{(.*?)}`/gi)));
        var data = global.data;
        for (var element of matches) {
            var el = element;
            element = element.toLowerCase().replace('`{', '').replace('}`', '').trim();
            var ctxScript = `
            const aps = global.aps;
            try{
            var els = await ${element};
            }catch(err){
                console.log(err);
                els = null;
            }
            if ((els) && (els != 'undefined')){
            html = html.replaceAll('` + el + `', els);
            } else{
            html = html.replaceAll('` + el + `', '');    
            };
            return html`;
            html = await eval(`(async (html) => {` + ctxScript + `})(html)`);
            if (rezim.toLowerCase() == 'js')
                html = '<script>' + html + '</script>';
            var a = html;
        };
        return html;

    }
    script = (script) => {
        eval(script);

    }

    get = (file) => {

        // this.app.get(['/', '/bz', '/bz/:id'], (req, res) => {
        //     res.send(html);
        // });
        // const bodyParser = require('body-parser'),
        const session = require('express-session');
        //     redisStorage = require('connect-redis')(session),
        //     redis = require('redis'),
        //     client = redis.createClient();

        // this.app.use(bodyParser.json());
        // this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(
            session({
                secret: 'sYCx3Is9u63ibBpAAAR',
                resave: true,
                saveUninitialized: true,
            })
        );

        this.app.use(function(req, res, next) {
            // console.log(req.session.key[req.sessionID].showAd)
            // if (!req.session.key) req.session.key = req.sessionID;
            //  req.session.key[req.sessionID].showAd = req.body.showAd;
            // if (req.session.name) {
            //     console.log(req.session.name)
            // }
            // req.session.name = 'GeeksforGeeks';
            let html = global.aps.compile(file, '', req);
            // const err = new Error('Ни хрена не найдено!');
            // err.status = 404;
            // next(err);
            res.send(html);
        });
        // this.app.all('/', function(req, res, next) {
        //     console.log('Буду выполнятся для любого запроса и пошлю запрос дальше по очереди ...');
        //     next(); // посылаю на х.. к следующему обработчику
        // });

        // this.app.get('/', function(req, res) {
        //     res.send('Получил GET запрос');
        // });

        // this.app.get('/*', function(req, res) {
        //     //let id = req.params.id;
        //     res.send('Получил GET bz: ');
        // });
        // this.app.get('/bz/:id', function(req, res) {
        //     let id = req.params.id;
        //     res.send('Получил GET запрос с параметром: ' + id);
        // });

        // this.app.post('/', function(req, res) {
        //     res.send('Получил POST запрос');
        // });

        // this.app.put('/', function(req, res) {
        //     res.send('Получил PUT запрос');
        // });

        // this.app.patch('/', function(req, res) {
        //     res.send('Получил PATCH запрос');
        // });

        // this.app.delete('/', function(req, res) {
        //     res.send('Получил DELETE запрос');
        // });
    }

    compilemenustatus = async() => {
        var sql = "SELECT id, name, image FROM app_s_status ORDER BY id";
        var rows = await global.db.getall(sql);
        var html = '';
        for (row of rows) {
            html += `<li status="${row.id}"><img src="${global.config.url.status}${row.image}">${row.name}</li>`;

        }
        return html;
    }

};