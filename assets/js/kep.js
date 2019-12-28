$(document).ready(function () {
    if($('.kepek-slider').length > 0){
        $('.kepek-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    }

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
});