let socket = io()

function scrollToBottom () {
    let messages = jQuery('#messages')
    let newMessage = messages.children('li:last-child')

    let clientHeight = messages.prop('clientHeight')
    let scrollTop = messages.prop('scrollTop')
    let scrollHeight = messages.prop('scrollHeight')
    let newMessageHeight = newMessage.innerHeight()
    let lastMessageHeight = newMessage.prev().innerHeight()

    if (clientHeight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search)

    document.title = `${params.room.toUpperCase()} | chat`

    socket.emit('join', params, function (err) {
    
        if(err) {
            alert(err)
            window.location.href = '/'
        } else {
            console.log('No error') 
        }
    })
})

socket.on('disconnect', function () {
    console.log('Disconnected from the server')
})

socket.on('updateUserList', function (users) {
    let ol = jQuery(`<ul></ul>`)
    let params = jQuery.deparam(window.location.search)

    users.forEach(function (user) {
        if (user === params.name) {
            ol.append(jQuery(`<li id="${user}" style="font-weight: 500; font-style: oblique"></li>`).text(user))
        } else {
            ol.append(jQuery(`<li id="${user}"></li>`).text(user))
        }
       
    })
    jQuery('#users').html(ol)
  
})

socket.on('userTyping', function (message) {

    let params = jQuery.deparam(window.location.search)

    if (params.name === message.name) {
        return jQuery(`#${message.name}`).text(message.name)
    } else {
        return jQuery(`#${message.name}`).text(message.text)
    }
})

socket.on('userDoneTyping', function (message) {
  
    let params = jQuery.deparam(window.location.search)

    if (params.name === message.name) {
        return jQuery(`#${message.name}`).text(message.name)
    } else {
        return jQuery(`#${message.name}`).text(message.text)
    }
})

socket.on('newMessage', function (message){
    let formattedTime = moment(message.createdAt).format('H:mm')
    let template
    if (message.from === 'Admin') {
        template = jQuery('#notification-template').html()
    } else {
        template = jQuery('#message-template').html()
    }
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })
    
    jQuery('#messages').append(html)
    scrollToBottom()
})

socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('H:mm')
    let template = jQuery('#location-message-template').html()
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    })

    jQuery('#messages').append(html)
    scrollToBottom()
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault()

    let messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')
        socket.emit('userDoneType')
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

let inputElement = document.getElementById('type-message')

inputElement.addEventListener('input', function (e) {
    let params = jQuery.deparam(window.location.search)

        if (e.target.value !== "") {
            socket.emit('userType', params)
        } 
})


