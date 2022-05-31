var error_notifi, notifi;

function error_show(message, time = 5000) {
    if (!$('#notification')[0]) {
        $('body').append('<span id="notification" style="display:none;"></span>')
        error_notifi = $('#notification').kendoNotification().data('kendoNotification')
    }
    error_notifi.setOptions({
        autoHideAfter: time
    })
    error_notifi.show(message, 'error')
}

function message_show(message, rezim, time = 5000) {
    if (!$('#idmessage')[0]) {
        $('body').append('<span id="idmessage" style="display:none;"></span>')
        notifi = $('#idmessage').kendoNotification().data('kendoNotification')
    }
    notifi.setOptions({
            autoHideAfter: time,
            hide: function() {
                $('#idmessage').remove();
            }
        })
        //"info", "success", "warning", and "error"
    notifi.show(message, rezim)
}

$.prototype.add_elem = function(html) {
    $html = `<div class='onelem' style='opacity:0'>${html}</div>`
    elem = this.append($html).find('.onelem:last')[0]
    $(elem).animate({
        opacity: '1'
    }, 400, function() {})
}

$.prototype.remove_elem = function() {
    this.closest('.onelem').animate({
        opacity: '0'
    }, 400, function() {
        $(this).remove()
    })
}

$.prototype.avatar = function(data) {

    if (!data.image || data.image == '') {
        data.type = "icon";
        data.icon = "user";
    } else {
        data.type = "image";
        data.image = url_foto + data.image;
    }
    $(this).kendoAvatar(data);

    var newElem = $("<div class='clavatart'/>")
    $(this).wrap(newElem);
    if (!data.size)
        classava = 'medium';
    else
        classava = data.size;
    setTimeout(() => {
        stt = '';
        if (data.status)
            stt = 'style = "background: url(' + url_status + data.status + ')";';
        us = '';
        if (data.user) {
            us = data.user.toLowerCase();
        }
        $(this).closest('.clavatart').append('<div class="blockavasts ava_' + classava + '"><div class="avastat" ava_user="' + us + '" title="' + data.title + '" ' + stt + '></div></div>')
        if (!data.status) {
            datas = {
                modul: {
                    name: "login",
                    file: "login",
                    function: "getstatus",
                },
                login: data.user,
                mystatus: true
            }
            get_io(datas)
        }
    }, 50);


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
        url: org_url
    }
    data = merge_options(dt, data)
    sockets.emit('message', data)
}

function serialize(elem, data) {
    forms = $(elem).serializeArray()
    var form = {}
    for (obj of forms) {
        form[obj.name] = obj.value
    }
    return merge_options(data, form)
}

function active_user() {
    data = {
        modul: {
            name: "login",
            file: "login",
            function: "getindex",

        },
        login: get_cookie('login'),
        socketid: socket_id,
        session: session
    }
    get_io(data)
}

function setUrls(curLoc, merc, clear = false) {
    if ((clear) || (merc == 0)) {
        window.history.pushState(null, null, '/' + curLoc)
        return
    }

    array = document.location.href.split('/')
    newar = []
    bol = false
    for (index = 3; index < array.length; index++) {
        if (merc == index - 2) {
            array[index] = curLoc
            bol = true
        }
        newar.push(array[index])
    }
    if ((merc == 0) || (!bol)) {
        newar.push(curLoc)
    }
    url = newar.join('/')

    if (bol)
        url = '/' + url

    window.history.pushState('', '', url)
}

function rus_to_latin(str) {
    var ru = {
            'а': 'a',
            'б': 'b',
            'в': 'v',
            'г': 'g',
            'д': 'd',
            'е': 'e',
            'ё': 'e',
            'ж': 'j',
            'з': 'z',
            'и': 'i',
            'к': 'k',
            'л': 'l',
            'м': 'm',
            'н': 'n',
            'о': 'o',
            'п': 'p',
            'р': 'r',
            'с': 's',
            'т': 't',
            'у': 'u',
            'ф': 'f',
            'х': 'h',
            'ц': 'c',
            'ч': 'ch',
            'ш': 'sh',
            'щ': 'shch',
            'ы': 'y',
            'э': 'e',
            'ю': 'u',
            'я': 'ya',
            ' ': '_'
        },
        n_str = []

    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i')

    for (var i = 0; i < str.length; ++i) {
        n_str.push(
            ru[str[i]] ||
            ru[str[i].toLowerCase()] == undefined && str[i] ||
            ru[str[i].toLowerCase()].toUpperCase()
        )
    }
    return n_str.join('')
}