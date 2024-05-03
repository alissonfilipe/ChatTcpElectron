const { ipcRenderer } = require('electron')
let tab = document.getElementById('tab2').querySelector('.client-form');
let fs = require('fs');


document.addEventListener('click', (e) => {
    if (e.target.id != 'close-client') return;

    ipcRenderer.send('close-client')
})

ipcRenderer.on('close-client-reply', (event, arg) => {

    fs.readFile('./markup/client-connect-form.html', function(err, data) {
        if (err) console.log(err);
        tab.innerHTML = data.toString()
    });
})