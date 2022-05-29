module.exports = class Tlogin {
    constructor() {

    }
    active = async(data) => {
        if (data.login && data.login != '') {
            //var row = await this.search('hash', 'name=?', [data.login], 1);
            if (global.config.test)
                return true;
            if (data.session && data.session == data.hash) {
                return true;
            } else return false;
        } else {
            return false;
        }
    }
    authenticate = (login, pass) => {
        const { authenticate } = require('ldap-authentication')
        let options = {
            ldapOpts: {
                url: global.config.ldap.url,
                // tlsOptions: { rejectUnauthorized: false }
            },
            adminDn: global.config.ldap.user,
            adminPassword: global.config.ldap.pass,
            userPassword: pass,
            userSearchBase: global.config.ldap.dn,
            usernameAttribute: 'mailNickname',
            username: login,
            // starttls: false
        }
        var user = authenticate(options)

        return user;
    }
    search = async(col, where, massiv = null, limit = 0) => {
        const table = {
            dolznost: "hv_s_dolznost",
            department: "hv_s_otdel"
        }

        where = (where != '') ? 'where ' + where : where;
        var kon = '';
        if (Array.isArray(col)) {
            var c = '';
            for (var cl of col) {
                var tab = '';
                if (eval(`table.${cl}`)) {
                    tab = eval(`table.${cl}`);
                    kon = kon + ` LEFT JOIN ${tab} as ${cl} ON a.${cl} = ${cl}.id`;
                    cl = `${cl}.name as ${cl}`;
                }
                if (tab == '')
                    cl = 'a.' + cl;
                c = c + cl + ', ';
            }
            c = c.slice(0, -2);
            col = c;
        } else
            col = (col == '') ? '*' : col;

        limit = (limit > 1) ? `limit ${limit}` : '';

        kon = (kon == '') ? '' : 'as a ' + kon;

        var sql = `select ${col} from dle_users ${kon} ${where} ${limit}`;
        if (limit = 1) {
            var rows = await global.db.getrow(sql, massiv);
        } else {
            var rows = await global.db.getAll(sql, massiv);
        }
        global.row = rows;
        return rows;
    };

}