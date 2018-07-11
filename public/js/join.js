let socket = io();
let select = jQuery('#rooms-select');

socket.on('UpdateRoomList', (rooms) => {
    if (!rooms.length > 0) {
        select.append( `<option value="" selected disabled hidden> -- No Activ Room -- </option>` )
    }
    rooms.forEach((room) => {
        select.append( `<option value="${room}">${room}</option>` )
    });
})

$('#rooms-select').click((e) => {
    jQuery('#room-name').val(e.target.value)
})

