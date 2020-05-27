const socket = io();

const select = document.getElementById('room');

socket.on('hello', respond => {
    console.log('respond at entering hello in game', respond)
    let html = '';
    respond.forEach(room => {
        console.log('room', room)
        if (room.players.length > 1) {
            html += `<option value="${room.name}" disabled>${room.name}</option>`
        } else {
            html += `<option value="${room.name}">${room.name}</option>`
        }
    });
    select.innerHTML = html;
});

socket.on('blocked', (room) => {
    //dodaj argument disabled do option danego pokoju
    console.log('now you can disable room', room);
    const options =  Array.from(document.querySelectorAll('option'));
    options.forEach(option => {
        if (option.value ===  room) {
            option.setAttribute('disabled', true)
        }
    })
})

socket.on('enabled', (room) => {
    //dodaj argument disabled do option danego pokoju
    console.log('now you can enable room', room);
    const options =  Array.from(document.querySelectorAll('option'));
    options.forEach(option => {
        if (option.value ===  room) {
            option.removeAttribute('disabled');
        }
    })
})