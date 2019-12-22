$(document).ready(function () {
    $('#idopont').on('click', function () {
        $('.modal').toggleClass('opened');
    });
    $('.modal .close-btn').on('click', function () {
        $('.modal').removeClass('opened');
    });
    $('.btn-modal').on('click', filterRows);

    $('.szuroModal').on('click', function () {
        $.ajax({
            url: '/pergetonaplo/szuro',
            method: 'POST',
            data: {id: this.id},
            error: function () {
                console.log("error");
            },
            success: function (res) {
                $('.modal-form').html(res);
                if($('.datepicker').length !== 0) datepickerInit();
            }
        });
    });
});

//---- FUNCTIONS ----//

function filterRows() {
    var fromInput = $('#dateFilterFrom').val();
    var toInput = $('#dateFilterTo').val();

    if ((!fromInput && !toInput) || (toInput !== "" && fromInput > toInput)) {
        $('.pnaplo-table tr').each(function(i, tr) {
            $(tr).css('display', 'table-row');
        });
        console.log('emptyerror')
        return;
    }

    fromInput = fromInput || '1970-01-01'; // default from to a old date if it is not set
    toInput = toInput || Date.now();

    var dateFrom = Date.parse(fromInput);
    var dateTo = Date.parse(toInput);
    $('.pnaplo-table tbody tr').each(function(i, tr) {
        var val = $(tr).find("td[data-time]").attr('data-time');
        var dateVal = Date.parse(val);
        if(dateVal >= dateFrom){
            visible = "table-row";
            if(dateVal > dateTo){
                visible = "none"
            }
        }else{
            visible = "none";
        }
        $(tr).css('display', visible);
    });
    $('.modal').removeClass('opened');
}