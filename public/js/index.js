let socket = io();
let select = jQuery('#rooms-select');

socket.on('UpdateRoomList', function(rooms) {

    rooms.forEach((room) => {
        select.append( `<option value="${room}">${room}</option>` )
    });
})