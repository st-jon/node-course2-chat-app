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

    let messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')
    })
})

let locationButton = jQuery('#send-location')

locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser.')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...')

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location.')
    })

})