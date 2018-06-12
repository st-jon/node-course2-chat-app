let socket = io()

socket.on('connect', function () {
    console.log('Connected to the server')

    socket.emit('createMessage', {
        from: 'Caro',
        text: 'Hey I m here'
    })
})

socket.on('disconnect', function () {
    console.log('Disconnected from the server')
})

socket.on('newMessage', function (message){
    console.log('you got 1 new message : ', message)
})