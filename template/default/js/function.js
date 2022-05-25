var error_notifi;

function error_show(message, time = 5000) {
    if (!$('#notification')[0]) {
        $('body').append('<span id="notification" style="display:none;"></span>');
        error_notifi = $("#notification").kendoNotification().data("kendoNotification");
    }
    error_notifi.setOptions({
        autoHideAfter: time,
    });
    error_notifi.show(message, 'error');
}

$.prototype.add_elem = function(html) {
    $html = `<div id='onelem' style='opacity:0'>${html}</div>`;
    this.append($html);
    this.find('#onelem').animate({
        opacity: '1'
    }, 400, function() {

    });
}

$.prototype.remove_elem = function() {
    this.closest('#onelem').animate({
        opacity: '0'
    }, 400, function() {
        $(this).remove()
    });
}

function merge_options(obj1, obj2) {
    var obj3 = {}
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname]
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname]
    }
    return obj3
}

function get_io(data) {
    dt = {

    }
    data = merge_options(dt, data);
    sockets.emit('message', data);
}

function serialize(elem, data) {
    forms = $(elem).serializeArray();
    var form = {};
    for (obj of forms) {
        form[obj.name] = obj.value;
    };
    return merge_options(data, form);
}


function test(elem) {
    error_show('Проверк ошибки <br> <b>Да это ещё одна проверка ошибки</b.', 10000)
    data = {
        elem: "#idtest",
        text: elem
    }
    sockets.emit('test', data);

}