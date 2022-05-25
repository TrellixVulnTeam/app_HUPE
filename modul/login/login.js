const Tlogin = require("./../../component/sitelogin");
var login = new Tlogin;

module.exports = function(data) {

    global.active = login.active(data);
    if (!global.active) {
        global.function.get_io({
            script: '$("body").html("");',
            append: {
                elem: 'body',
                html: global.aps.compile(global.config.dir.modul + '/login/login.html'),
            }
        })
    }
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
        script = `$('#login').closest('.k-input')
        .after('<span class="k-form-error k-invalid-msg" data-for="login" id="login-error">Неверный пароль</span>');`;
    } else if (auth.accountExpires) {
        script = `set_cookie('user', '${data.login}')`;
    }
    script = script + `$butdalee.enable(true);`;
    global.function.get_io({
        script: script,
    })
}