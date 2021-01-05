var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  var clientIp = socket.request.connection.remoteAddress;
  var cliIp = clientIp.slice(7);

  console.log(`${clientIp} has connected`);
  io.emit('system message', `SYSTEM:${cliIp} has joined.`)

  socket.on('chat message', (m) => {
    console.log(`${clientIp} :${m}`);
    io.emit('chat message', `${cliIp}:${m}`);
  });

  socket.on('disconnect', () => {
    console.log(`${clientIp} has disconnected`)
    io.emit('system message', `SYSTEM:${cliIp} has left.`)
  })
});

http.listen(port, () => {
  console.log(`listening on port*:${port}`);
});