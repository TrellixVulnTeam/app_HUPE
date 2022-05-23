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

function test(elem) {
    error_show('Проверк ошибки <br> <b>Да это ещё одна проверка ошибки</b.', 10000)
    data = {
        elem: "#idtest",
        text: elem
    }
    sockets.emit('test', data);

}