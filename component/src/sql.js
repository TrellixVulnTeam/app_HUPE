"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queryable = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const stream_1 = require("stream");
class Queryable {
    constructor(conn) {
        this.conn = conn;
    }
    query(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!options)
                options = {};
            if (typeof binds === 'object' && !Array.isArray(binds))
                options.namedPlaceholders = true;
            try {
                return yield new Promise((resolve, reject) => {
                    if (options === null || options === void 0 ? void 0 : options.saveAsPrepared) {
                        this.conn.execute(Object.assign(Object.assign({}, options), { sql, values: binds }), (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    } else {
                        this.conn.query(Object.assign(Object.assign({}, options), { sql, values: binds }), (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    }
                });
            } catch (e) {
                e.clientstack = e.stack;
                Error.captureStackTrace(e, this.query);
                throw e;
            }
        });
    }
    getval(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const row = yield this.getrow(sql, binds, Object.assign(Object.assign({}, options), { rowsAsArray: true }));
            return row === null || row === void 0 ? void 0 : row[0];
        });
    }
    getvals(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const rows = yield this.getall(sql, binds, Object.assign(Object.assign({}, options), { rowsAsArray: true }));
            return rows.map(r => r[0]);
        });
    }
    getrow(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const results = yield this.query(sql, binds, options);
            if ((results === null || results === void 0 ? void 0 : results.length) > 0)
                return results === null || results === void 0 ? void 0 : results[0];
        });
    }
    getall(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const results = yield this.query(sql, binds, options);
            return results;
        });
    }
    execute(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.query(sql, binds, options);
            return true;
        });
    }
    update(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const result = yield this.query(sql, binds, options);
            return result.affectedRows;
        });
    }
    delete(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this.update(sql, binds, options);
        });
    }
    insert(sql, binds, options) {
        return __awaiter(this, void 0, void 0, function*() {
            const result = yield this.query(sql, binds, options);
            return result.insertId;
        });
    }
    feedStream(stream, sql, binds, options = {}) {
        if (stream.destroyed)
            return;
        const req = (options === null || options === void 0 ? void 0 : options.saveAsPrepared) ? this.conn.execute(Object.assign(Object.assign({}, options), { sql, values: binds })) : this.conn.query(Object.assign(Object.assign({}, options), { sql, values: binds }));
        const reqany = req;
        let canceled = false;
        const stacktraceError = {};
        Error.captureStackTrace(stacktraceError, this.feedStream);
        stream._read = () => {
            var _a;
            (_a = reqany._connection) === null || _a === void 0 ? void 0 : _a.resume();
        };
        stream._destroy = (err, cb) => {
            var _a;
            if (err)
                stream.emit('error', err);
            canceled = true;
            (_a = reqany._connection) === null || _a === void 0 ? void 0 : _a.resume();
            cb();
        };
        req.on('result', (row) => {
            if (canceled)
                return;
            if (!stream.push(row)) {
                reqany._connection.pause();
            }
        });
        req.on('error', err => {
            var _a;
            if (canceled)
                return;
            err.clientstack = err.stack;
            err.stack = ((_a = stacktraceError.stack) !== null && _a !== void 0 ? _a : '').replace(/^Error:/, `Error: ${err.message}`);
            stream.emit('error', err);
        });
        req.on('end', () => {
            if (canceled)
                return;
            stream.push(null);
        });
    }
    handleStreamOptions(sql, bindsOrOptions, options) {
        let binds;
        if (!options && ((bindsOrOptions === null || bindsOrOptions === void 0 ? void 0 : bindsOrOptions.highWaterMark) || (bindsOrOptions === null || bindsOrOptions === void 0 ? void 0 : bindsOrOptions.objectMode))) {
            options = bindsOrOptions;
            binds = [];
        } else {
            binds = bindsOrOptions;
        }
        const queryOptions = {
            saveAsPrepared: options === null || options === void 0 ? void 0 : options.saveAsPrepared,
            nestTables: options === null || options === void 0 ? void 0 : options.nestTables,
            rowsAsArray: options === null || options === void 0 ? void 0 : options.rowsAsArray
        };
        const streamOptions = {
            highWaterMark: options === null || options === void 0 ? void 0 : options.highWaterMark
        };
        const stream = new stream_1.Readable(Object.assign(Object.assign({}, streamOptions), { objectMode: true }));
        stream._read = () => {};
        stream._destroy = (err, cb) => {
            if (err)
                stream.emit('error', err);
            cb();
        };
        return { binds, queryOptions, stream };
    }
    stream(sql, bindsOrOptions, options) {
        const { binds, queryOptions, stream } = this.handleStreamOptions(sql, bindsOrOptions, options);
        this.feedStream(stream, sql, binds, queryOptions);
        return stream;
    }
    iterator(sql, bindsOrOptions, options) {
            const ret = this.stream(sql, bindsOrOptions, options)[Symbol.asyncIterator]();
            return ret;
        } in (binds, newbinds) {
            const inElements = [];
            if (Array.isArray(binds)) {
                for (const bind of newbinds) {
                    if (Array.isArray(bind)) { // tuple
                        binds.push(...bind);
                        inElements.push(`(${bind.map(() => '?').join(',')})`);
                    } else { // normal
                        binds.push(bind);
                        inElements.push('?');
                    }
                }
            } else {
                let startindex = Object.keys(binds).length;
                for (const bind of newbinds) {
                    if (Array.isArray(bind)) { // tuple
                        inElements.push(`(${bind.map((str, i) => `:bindin${i + startindex}`).join(',')})`);
                    for (let i = 0; i < bind.length; i++) {
                        binds[`bindin${i + startindex}`] = bind[i];
                    }
                    startindex += bind.length;
                }
                else { // normal
                    inElements.push(`:bindin${startindex}`);
                    binds[`bindin${startindex}`] = bind;
                    startindex++;
                }
            }
        }
        return inElements.join(',');
    }
}
exports.Queryable = Queryable;
class Db extends Queryable {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        const skiptzfix = ((_a = config === null || config === void 0 ? void 0 : config.skiptzfix) !== null && _a !== void 0 ? _a : false) || Boolean(process.env.MYSQL_SKIPTZFIX);
        config === null || config === void 0 ? true : delete config.skiptzfix;
        const poolSizeString = (_b = process.env.MYSQL_POOL_SIZE) !== null && _b !== void 0 ? _b : process.env.DB_POOL_SIZE;
        const pool = mysql2_1.default.createPool(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, config), { host: (_e = (_d = (_c = config === null || config === void 0 ? void 0 : config.host) !== null && _c !== void 0 ? _c : process.env.MYSQL_HOST) !== null && _d !== void 0 ? _d : process.env.DB_HOST) !== null && _e !== void 0 ? _e : 'mysql', port: (_f = config === null || config === void 0 ? void 0 : config.port) !== null && _f !== void 0 ? _f : parseInt((_h = (_g = process.env.MYSQL_PORT) !== null && _g !== void 0 ? _g : process.env.DB_PORT) !== null && _h !== void 0 ? _h : '3306'), user: (_l = (_k = (_j = config === null || config === void 0 ? void 0 : config.user) !== null && _j !== void 0 ? _j : process.env.MYSQL_USER) !== null && _k !== void 0 ? _k : process.env.DB_USER) !== null && _l !== void 0 ? _l : 'root', password: (_p = (_o = (_m = config === null || config === void 0 ? void 0 : config.password) !== null && _m !== void 0 ? _m : process.env.MYSQL_PASS) !== null && _o !== void 0 ? _o : process.env.DB_PASS) !== null && _p !== void 0 ? _p : 'secret', database: (_s = (_r = (_q = config === null || config === void 0 ? void 0 : config.database) !== null && _q !== void 0 ? _q : process.env.MYSQL_DATABASE) !== null && _r !== void 0 ? _r : process.env.DB_DATABASE) !== null && _s !== void 0 ? _s : 'default_database', 
            // client side connectTimeout is unstable in mysql2 library
            // it throws an error you can't catch and crashes node
            // best to leave this at 0 (disabled)
            connectTimeout: 0 }), (!skiptzfix ? { timezone: 'Z' } : {})), (poolSizeString ? { connectionLimit: parseInt(poolSizeString) } : {})), { flags: [...((_t = config === null || config === void 0 ? void 0 : config.flags) !== null && _t !== void 0 ? _t : []), ...(((_u = config === null || config === void 0 ? void 0 : config.flags) === null || _u === void 0 ? void 0 : _u.some(f => f.includes('FOUND_ROWS'))) ? [] : ['-FOUND_ROWS'])] }));
        if (!skiptzfix) {
            pool.on('connection', function (connection) {
               // connection.query('SET time_zone="UTC"');
            });
        }
        super(pool);
        this.pool = pool;
    }
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                try {
                    yield this.getrow('select 1');
                    break;
                }
                catch (e) {
                    if (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED') {
                        yield new Promise(resolve => setTimeout(resolve, 500));
                    }
                    else {
                        throw e;
                    }
                }
            }
        });
    }
    transaction(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield new Promise((resolve, reject) => {
                this.pool.getConnection((err, conn) => {
                    if (err)
                        reject(err);
                    else
                        resolve(conn);
                });
            });
            const db = new Queryable(conn);
            try {
                yield db.execute('START TRANSACTION');
                try {
                    const ret = yield callback(db);
                    yield db.execute('COMMIT');
                    return ret;
                }
                catch (e) {
                    const isDeadlock = e.errno === 1213;
                    if (isDeadlock && (options === null || options === void 0 ? void 0 : options.retries)) {
                        return yield this.transaction(callback, Object.assign(Object.assign({}, options), { retries: options.retries - 1 }));
                    }
                    else {
                        if (!isDeadlock)
                            yield db.execute('ROLLBACK');
                        throw e;
                    }
                }
            }
            finally {
                conn.release();
            }
        });
    }
}
exports.default = Db;
//# sourceMappingURL=sql.js.map