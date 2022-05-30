$('#idadd_bz').on('click', function() {
    data = {
        modul: {
            name: "bz",
            file: "bz",
            function: "add_edit_bz",
        },
    }
    get_io(data);
})