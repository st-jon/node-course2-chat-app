let socket = io();
let select = jQuery('#rooms-select');

socket.on('UpdateRoomList', (rooms) => {

    rooms.forEach((room) => {
        select.append( `<option value="${room}">${room}</option>` )
    });
})

$('#rooms-select').click((e) => {
    jQuery('#room-name').val(e.target.value)
})