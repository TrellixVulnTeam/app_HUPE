const configger = require('nconf');
const fs = require('fs');

function LoadConfig() {
    configger.load = function(defaults) {
        configger.argv().env({ whitelist: ['configFile'] })
        var configFile = './data/config.json';
        if (configger.get('configFile')) {
            configFile = configger.get('configFile')
        }
        if (!fs.existsSync(configFile)) {
            throw {
                name: 'FileNotFoundException',
                message: 'Unable to find configFile ' + configFile
            }
        }
        configger.file(configFile)
        configger.defaults(defaults)
        return configger.get()
    }

    return configger.load()
}

global.config = LoadConfig();
global.config.prefiks = '';
global.config.dir.client = global.path.join(__dirname, '..', global.config.dir.template + '/' + global.config.dir.skin + '/');
global.config.dir.server = global.path.join(__dirname, '..');
global.config.template = global.config.prefiks + global.config.dir.template + '/' + global.config.dir.skin + '/';
global.config.kendocss = global.config.prefiks + global.config.dir.template + '/' + global.config.dir.skin + '/css/kendo/';
global.config.kendojs = global.config.prefiks + global.config.dir.template + '/' + global.config.dir.skin + '/js/kendo/';
global.config.js = global.config.dir.template + '/' + global.config.dir.skin + '/js/';
global.config.jscomponent = global.config.prefiks + global.config.dir.template + '/' + global.config.dir.skin + '/js/component/';
global.config.css = global.config.prefiks + global.config.dir.template + '/' + global.config.dir.skin + '/css/';
global.config.server.url = config.server.http + '://' + config.server.host + '/';

global.config.dir.clientmodul = global.config.dir.client + global.config.dir.modul + '/';