const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 750,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.setMenu(null);
    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

var server = {};
var client = {};
var serverClients = {
    users: [],
    get count() {
        return this.users.length;
    }
};

function outerSend(data) {
    ipcRenderer.send('got-message', data)
}

ipcMain.on('run-server', (event, arg) => {
    const ip = arg.ip;
    const port = arg.port;

    var net = require('net');

    function sendMessage(user, data) {
        let hours = `${new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()}`;
        let minutes = `${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()}`;
        let messageObj = { user: user, message: data.toString().trim(), date: `${hours}:${minutes}` };

        serverClients.users.forEach((conn) => {
            if (user != conn.nickname) {
                conn.write(JSON.stringify(messageObj));
            } else {
                let selfMessage = {...messageObj, self: true };
                conn.write(JSON.stringify(selfMessage));
            }
        });

        event.sender.send('got-message-reply', JSON.stringify(messageObj));
    }

    server = net.createServer(function(conn) {
        serverClients.users.push(conn);
        conn.id = serverClients.count - 1;

        conn.on('data', function(data) {
            if (!conn.nickname) conn.nickname = data.toString().trim();
            sendMessage(conn.nickname, data);
        });

        conn.on('close', function() {
            serverClients.users.splice(conn.id, 1);
        });

        conn.on("error", () => {});
    })

    server.on('connection', function(conn) {
        console.log(`cliente conectado`);
    })

    server.on('error', function(err) {
        if (err.code == 'EADDRINUSE') {
            console.warn('endereço em uso, tente novamente...');
            setTimeout(() => {
                server.close();
            }, 1000);
        } else {
            console.error(err);
        }
    });

    server.on('listening', function() {
        event.sender.send('run-server-reply', { 'ip': ip, 'port': port });
    });
    server.listen(port, ip);
})

ipcMain.on('close-server', (event, arg) => {
    serverClients.users.forEach(client => {
        client.end();
    })
    server.close((err, data) => {
        if (err) console.log(err);
        event.sender.send('close-server-reply', {});
        server.unref();
    });
});

ipcMain.on('client-connect', (event, arg) => {
    var net = require('net');
    client = new net.Socket();
    client.setEncoding('utf8');

    client.on('close', function() {
        console.log('A conexao foi fechada');
    });

    const ip = arg.ip;
    const port = arg.port;
    const nickname = arg.nickname;
    client.on('data', function(data) {
        event.sender.send('new-message-reply', data);
    });

    client.connect(port, ip, function() {
        event.sender.send('client-connect-reply', JSON.stringify({ ip: ip, nickname: nickname }));
        client.write(nickname);
    });
});

ipcMain.on('got-message', (event, arg) => {
    event.sender.send('got-message-reply', arg);
});

ipcMain.on('send-message', (event, arg) => {
    client.write(arg);
})

ipcMain.on('close-client', (event, arg) => {
    client.end();
    event.sender.send('close-client-reply');
})