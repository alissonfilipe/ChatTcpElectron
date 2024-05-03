const { ipcRenderer } = require('electron')

document.addEventListener('click', (e) => {
   if(e.target.id != 'close-server') return;
   ipcRenderer.send('close-server')
})

ipcRenderer.on('close-server-reply', (event, arg) => {
   let tab = document.getElementById('tab1').querySelector('.server-form');
   let fs = require('fs');
   fs.readFile('./markup/create-server-form.html', function(err, data) {
      if (err) console.log(err);
      tab.innerHTML = data.toString()
      
      require('dns').lookup(require('os').hostname(), {family: 4, all: true}, (err, add, fam) => {
         if (err) console.log(err);
         let ipSelect = document.getElementById('ip-select')
         add.forEach((val, i) => {
            let option = new Option(val.address);
            ipSelect.append(option);
         })
         ipSelect.selectedIndex = 0;
      })
   });
});