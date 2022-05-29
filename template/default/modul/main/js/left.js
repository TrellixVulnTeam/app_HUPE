$('.clleftbut').on('click', function() {
    if ($(this).hasClass('butactive'))
        return false;

    $('.butactive').removeClass('butactive');
    $(this).addClass('butactive');

    // url = $(this).attr('href');
    // setUrls(url, 0, true);
    data = {
        modul: {
            name: "component",
            file: "parser",
            function: "parser",

        },
        url: $(this).attr('href')
    }
    get_io(data)
    return false;
})