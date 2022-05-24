const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');

function sasss() {
    return src('./template/default/sass/**/*.sass') // берём все SASS-файлы 
        .pipe(sass({
            outputStyle: 'nested', // вложенный (по умолчанию) 
        }).on('error', sass.logError)) // уведомление об ошибках
        .pipe(dest('./template/default/css/')); // выгружаем результат 
}

exports.sass = sasss;