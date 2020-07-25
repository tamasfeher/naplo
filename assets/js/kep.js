$(document).ready(function () {
    if($('.kepek-slider').length > 0){
        $('.kepek-slider').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 6000,
            infinite: false,
            arrows: false,
            responsive: [
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
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