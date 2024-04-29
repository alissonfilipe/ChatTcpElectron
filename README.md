<h1>CHAT TCP ELECTRON NODE</h1>

<h2>Desenvolvimento</h2>
<p>após a verificações das exigências do professor descobri que eu precisava colar quando o usuário entra e o nome do usuário e quando o usuário sai, 
por isso que eu adicionei mais funções para esse projeto. 
</p>





<h2>Explicação</h2>
# Inicialização da Janela Principal
Este código é uma aplicação usando Electron, um framework para desenvolvimento de aplicativos desktop multiplataforma com tecnologias web (HTML, CSS e JavaScript).

1. Ele importa as classes `app` e `BrowserWindow` do módulo `electron`.
2. Define a função `createWindow()` que cria uma nova janela (`BrowserWindow`) com configurações como largura, altura e integração com o Node.js (habilitando `nodeIntegration` nas `webPreferences`).
3. Quando a janela é fechada (`'closed'`), a variável `win` é definida como `null`.

## Eventos da Aplicação
O código lida com eventos da aplicação para controle do ciclo de vida das janelas e do aplicativo:
- O evento `'ready'` é acionado quando o aplicativo Electron está pronto para criar janelas. Ele chama a função `createWindow()` quando isso acontece.
- O evento `'window-all-closed'` é acionado quando todas as janelas do aplicativo são fechadas. Ele verifica a plataforma atual e encerra o aplicativo se não for macOS.
- O evento `'activate'` é acionado quando o aplicativo é ativado e não possui janelas abertas, chamando `createWindow()` para criar uma nova janela nesse caso.

## Comunicação entre Processos (IPC)
O código utiliza a comunicação entre processos (IPC) para permitir a troca de informações entre o processo principal (backend) e o processo de renderização (frontend) da aplicação:
- Importa os módulos `ipcMain` e `ipcRenderer` do Electron para facilitar essa comunicação.
- Possui manipuladores de eventos para ações como iniciar um servidor, fechar um servidor, conectar um cliente, enviar mensagens, entre outros.
- Por exemplo, quando o evento `'run-server'` é acionado, ele cria um servidor TCP usando o módulo `net`, define manipuladores de eventos para conexões e mensagens, e envia respostas de volta para o frontend usando `event.sender.send()`.

## Blocos de Código Específicos
Além das funcionalidades principais, o código inclui blocos específicos para tarefas como criar e gerenciar um servidor TCP, conectar clientes a esse servidor, enviar e receber mensagens entre o servidor e os clientes, etc.:
- Há um bloco que lida com a criação e gerenciamento de um servidor TCP, incluindo o envio de mensagens para clientes conectados.
- Outro bloco lida com a conexão de clientes ao servidor TCP, mostrando mensagens do servidor e enviando mensagens para ele.
