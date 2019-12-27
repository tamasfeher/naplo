$(document).ready(function () {
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
                $('.modal').toggleClass('opened');
            }
        });
    });
});

//---- FUNCTIONS ----//

function filterRows () {
    switch ($('#filterBy').text()) {
        case 'idopont':
            filterByDate();
            break;
        case 'hely':
            filterByPlace();
            break;
    }
    $('.modal').removeClass('opened');
}

function filterByDate() {
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
        let display = 'none';
        var val = $(tr).find("td[data-time]").attr('data-time');
        var dateVal = Date.parse(val);
        if(dateVal >= dateFrom){
            display = "table-row";
            if(dateVal > dateTo){
                display = "none"
            }
        }
        $(tr).css('display', display);
    });
}

function filterByPlace() {
    let hely = $('#filterPlace').val();
    if(hely === ''){
        $('.pnaplo-table tbody tr').css('display', 'table-row');
    }else {
        $('.pnaplo-table tbody tr').each(function (i, tr) {
            var val = $(tr).find("td:nth-child(2)").text();
            let display = 'none';
            if (val.includes(hely)) {
                display = "table-row";
            }
            $(tr).css('display', display);
        });
    }
}