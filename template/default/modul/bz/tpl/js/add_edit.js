$("[name=namebz]").kendoTextBox({
    placeholder: "",
    label: {
        content: "Наименование базы знаний",
        floating: true
    },
    size: "large",
    fillMode: "flat",
    rounded: "full"
})
var identif = $("[name=ident]").kendoTextBox({
    placeholder: "",
    label: {
        content: "Идентификатор",
        floating: true,
    },
    size: "large",
    fillMode: "flat",
    rounded: "full"
}).data("kendoTextBox");

var dcategory = $("#idcategory").kendoDropDownList({
    dataTextField: "name",
    dataValueField: "id",
    filter: "startswith",
    noDataTemplate: $("#noDataTemplatecategory").html(),
    dataSource: `{await global.function.compiledropdownlist("app_bz_cat","id, name", "ORDER BY id")}`,
    index: 0,
    //change: onChange
}).data("kendoDropDownList");;

function addNewCategory(widgetId, value) {
    var dataSource = dcategory.dataSource;
    dataSource.add({
        name: value,
        id: value
    });
    dcategory.select(dataSource.view().length - 1);
    //dcategory.close();
};

$("#idbzopisan").kendoTextArea({
    rows: 3,
    maxLength: 200,
    //placeholder: "Enter your text here.",
    label: {
        content: "Описание",
        floating: true,
    },
});

$(function() {
    $('.input-images').imageUploader({
        imagesInputName: 'images',
        preloadedInputName: 'preloaded',
        label: 'Drag & Drop files here or click to browse',
        multiple: false
    });
});

$('#idbutsave').kendoButton({
    icon: 'save',
    themeColor: "primary",
    click: function() {}
})

$('#idbutotmena').kendoButton({
    icon: 'close',
    click: function() {
        wind.close()
    }
})


$('#formaddbz').keydown(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
})

var wind = $("#idaddbz").kendoWindow({
    title: "Создать базу знаний",
    actions: ["close"],
    draggable: false,
    resizable: false,
    visible: false,
    modal: true,
    pinned: false,
    close: function() {
        setTimeout(() => {
            $('#fom-window').remove_elem();
            $('.k-window, .k-overlay').remove();
            $('#idadd_bz').css('display', '');
        }, 500);

    }
}).data("kendoWindow");

wind.center();
$(".k-window").css('top', '10%');
wind.open();

$("[name=namebz]").on('input', function() {
    var sil = rus_to_latin($(this).val()).toLowerCase();
    $('[name=ident]').val(sil);
    $("#idprimsilka").text(sil)
    identif.floatingLabel.refresh();
    prover_ident()
})

var timiden;

$("[name=ident]").on('input', function() {
    var sil = rus_to_latin($(this).val()).toLowerCase();
    this.value = sil;
    $("#idprimsilka").text(sil);
    prover_ident()
})

function prover_ident() {
    if (timiden) clearTimeout(timiden);
    timiden = setTimeout(() => {
        val = $("[name=ident]").val();
        if (val == '') {
            $("#idcheind").css('display', 'none');
            return;
        }
        data = {
            modul: {
                name: "bz",
                file: "bz",
                function: "prover_ident",
            },
            ident: val
        }
        get_io(data)
    }, 200);
}

$('#formaddbz').on('submit', function(event) {
    if ($('.nocheck')[0]) {
        message_show('Идентификатор занят', 'warning');
        event.preventDefault();
        return false;
    }
    var $input = $(".image-uploader input");
    var imfile;
    if ($input.prop('files')[0]) {
        imfile = {
            buff: $input.prop('files')[0],
            name: $input.prop('files')[0].name
        }
    }
    data = {
        modul: {
            name: "bz",
            file: "bz",
            function: "save_new_bz",
        },
        images: imfile
    }
    data = serialize("#formaddbz", data);
    get_io(data)

    return false;
})