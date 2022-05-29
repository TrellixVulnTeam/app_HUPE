var inlogin = $("#login").kendoTextBox({
    placeholder: "",
    label: {
        content: "Электронная почта или логин",
        floating: true
    },
    size: "large",
    fillMode: "flat",
    rounded: "full"
}).data("kendoTextBox");

var logins;

var $butdalee = $("#iddalee").kendoButton({
    themeColor: "primary",
    enable: true,
    click: function(e) {
        var validator = $("#formlofin").kendoValidator().data("kendoValidator");
        if (!validator.validate()) {
            return;
        }
        $butdalee.enable(false);
        if ($('.div_login').attr('rez') == '0') {
            data = {
                modul: {
                    name: "login",
                    file: "login",
                    function: "getlogin",
                },
            }
            logins = $('#login').val();
            data = serialize("#formlofin", data);
        } else {
            data = {
                modul: {
                    name: "login",
                    file: "login",
                    function: "getpass",
                },
                login: logins,
                pass: $('#login').val(),
                session: session
            }
        }
        get_io(data);
    }
}).data("kendoButton");


$("#login").on('keyup', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $("#iddalee").click();
    }
});

$("#idnazad").kendoButton({
    themeColor: "base",
    enable: true,
    click: function(e) {
        $("#idnazad").css('display', 'none')
        inlogin.setOptions({
            label: {
                content: "Электронная почта или логин",
            },
        });
        $('.k-form-error').remove();
        $('#login').val('').attr('validationMessage', 'Введите логин').attr('type', 'text').attr('name', 'login').focus();
        $('#idzamen').html('<div class="Voiti title"><span>Войти</span></div>');
        $('.div_login').attr('rez', '0');
    }
})

$("#login").focus();