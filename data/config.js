const configger = require('nconf');
const fs = require('fs');
const path = require('path');

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
global.config.dir.client = path.join(__dirname, '..', global.config.dir.template + '/' + global.config.dir.skin + '/');
global.config.template = './' + global.config.dir.template + '/' + global.config.dir.skin + '/';
global.config.kendocss = './' + global.config.dir.template + '/' + global.config.dir.skin + '/css/kendo/';
global.config.kendojs = './' + global.config.dir.template + '/' + global.config.dir.skin + '/js/kendo/';
global.config.js = './' + global.config.dir.template + '/' + global.config.dir.skin + '/js/';
global.config.jscomponent = './' + global.config.dir.template + '/' + global.config.dir.skin + '/js/component/';
global.config.css = './' + global.config.dir.template + '/' + global.config.dir.skin + '/css/';