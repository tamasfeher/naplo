$(document).ready(function () {

    $('.mucsali-btns > div').on('click', function () {
        show(this.id);
    });

    $('.attach-icon').on('click', function () {
        $('#fileInput').trigger('click');
    });

    $('#fileInput').on('change', function () {
        if(this.files.length > 0) {
            $('#fileName').text(this.files[0].name);
        }else{
            $('#fileName').text('');
        }
    });

    $('.delete-btn').on('click', function () {
        $('#delete').trigger('click');
    });

});

//---- FUNCTIONS ----//

function show(el) {
    $('.mucsali-block').css("display", "none");
    $('.'+el).css("display", "grid");
}