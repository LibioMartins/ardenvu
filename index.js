const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuração da pasta estática para o cliente
app.use(express.static(__dirname + '/public'));

// Array global para armazenar os usuários conectados
const connectedUsers = [];

// Configuração do evento de conexão de um cliente
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento para receber os dados de desenho do cliente
  socket.on('draw', (data) => {
    // Emitir os dados para todos os clientes conectados, incluindo o emissor
    io.emit('draw', data);
  });
  socket.on('image', (data) => {
    io.emit('image', data);
  });
  

  // Evento de recebimento do login
  socket.on('login', (data) => {
    // Adicionar o usuário à lista de usuários conectados
    connectedUsers.push(data.username);
    
    // Atribuir o nome de usuário ao socket
    socket.username = data.username;
  
    // Emitir a lista de usuários conectados para todos os clientes
    io.emit('userList', connectedUsers);
  });
  // Evento para receber dados de texto do cliente
  socket.on('text', (data) => {
   
    // Emitir os dados de texto para todos os clientes conectados, incluindo o emissor
    io.emit('text', data);
  });
  
  // Evento de desconexão de um cliente
  socket.on('disconnect', () => {
  console.log('Cliente desconectado');

  // Remover o usuário da lista de usuários conectados quando ele se desconectar
  const index = connectedUsers.indexOf(socket.username);
  if (index !== -1) {
    connectedUsers.splice(index, 1);
    io.emit('userList', connectedUsers);
  }
  });
  
});

// Iniciar o servidor na porta desejada
const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
