let socket = io()

socket.on('connect', function () {
    console.log('Connected to the server')
})

socket.on('disconnect', function () {
    console.log('Disconnected from the server')
})

socket.on('newMessage', function (message){
    console.log('you got 1 new message : ', message)
    let li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function (message) {
    let li = jQuery('<li></li>')
    let a = jQuery('<a target="_blank">My current location</a>')

    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)

    jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault()

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    })
})

let locationButton = jQuery('#send-location')

locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location.')
    })

})