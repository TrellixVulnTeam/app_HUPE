const await = require("await");
const Tlogin = require("./../../component/sitelogin");
var login = new Tlogin;
global.login = login;

module.exports = async function(data) {

    global.active = await login.active(data);
    if (!global.active) {
        global.function.get_io({
            script: '$("body").html("");',
            append: {
                elem: 'body',
                html: global.aps.compile(global.config.dir.modul + '/login/login.html'),
            }
        })
    } else {
        //global.socket.id = data.login;
        global.data = data;
        global.function.get_io({
            script: `active_user();`,
        })

    }
}

module.exports.getindex = async function(data) {
    global.data = data;
    await global.function.set_status({ user: data.login, socket: data.socketid })


    var html = await global.aps.compilesync(global.config.dir.modul + '/main/main.html');
    data.html = html;
    html = await global.parser(data)

    global.function.get_io({
        script: `var login = '${data.login}';`,
        append: {
            elem: 'body',
            html: html,
        }
    })
}

module.exports.getlogin = async function(data) {
    global.row = await login.search(['fullname', 'foto', 'dolznost', 'department'], 'a.name=? or a.email=?', [data.login, data.login], 1);
    var script = '';
    if (global.row) {
        html = global.aps.compile(global.config.dir.modul + '/login/pass.html');
        script = `$('#idzamen').html(\`${html}\`);`;
    } else {
        script = `$('#login').closest('.k-input')
        .after('<span class="k-form-error k-invalid-msg" data-for="login" id="login-error">Пользователь не найден в базе данных!</span>');`;
    }
    script = script + `$butdalee.enable(true);`;
    global.function.get_io({
        script: script,
    })

}

module.exports.getpass = async function(data) {
    try {
        var auth = await login.authenticate(data.login, data.pass);
    } catch {
        var auth = false;
    }
    if (!auth) {
        var script = `$('#login').closest('.k-input')
        .after('<span class="k-form-error k-invalid-msg" data-for="login" id="login-error">Неверный пароль</span>');`;
        script = script + `$butdalee.enable(true);`;
        global.function.get_io({
            script: script,
        })
    } else if (auth.accountExpires) {
        // var crypto = require('crypto');
        // var hash = crypto.createHash('md5').update(global.socket.id).digest('hex');
        // db.update('Update dle_users set hash =? WHERE name=?', [hash, data.login])
        //global.socket.id = data.login;
        var script = `set_cookie('session', '${data.session}');set_cookie('login', '${data.login}');active_user();`;
        global.function.get_io({
            script: script,
            script_end: `$(".div_login").remove_elem();`,
        })
    }

}

module.exports.getstatus = async function(data) {
    var row = await global.db.getrow("SELECT b.name, b.image FROM app_status as a LEFT JOIN app_s_status as b ON a.status = b.id WHERE a.user = ? ", [data.login]);
    if (!row) {
        row = {
            name: 'Не в стети',
            image: 'nevseti.svg'
        }
    }
    var script = '';
    if (data.login) {
        script = `$('[ava_user=${data.login.toLowerCase()}]').css('background', 'url(${global.config.url.status}${row.image})').attr('title','${row.name}');`;
    }

    if (data.mystatus) {
        script += `$('#idpostatus').text('${row.name}');`;
    }
    global.function.get_io({
        script: script,
    })
}