$(document).ready(function () {
    if($('.datepicker').length !== 0) datepickerInit();
});


//---- FUNCTIONS ----//

function datepickerInit() {
    $('.datepicker').each( function(){
        datepicker('#'+this.id, {
            customMonths: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
                'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
            customDays: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
            startDay: 1,
            formatter: (input, date, instance) => {
                const value = formatDate(date)
                input.value = value // => '1/1/2099'
            },
            overlayPlaceholder: 'Adjon meg egy évszámot...',
            overlayButton: "Ugrás"
        });
    })
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
