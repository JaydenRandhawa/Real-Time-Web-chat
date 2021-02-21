var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = 8080;

var conUsers = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  var clientIp = socket.request.connection.remoteAddress;
  var cliIp = clientIp.slice(7);

  console.log(`${clientIp} has connected`);
  io.emit('system message', `SYSTEM:${cliIp} has joined.`)

  conUsers += 1;
  console.log(conUsers);

  if(conUsers == 1){
    io.emit('system message', `It looks like you are the only one here...`);
  }
  else{
    io.emit('system message', `There are now ${conUsers} people online`);
  }

  socket.on('chat message', (m) => {
    console.log(`${clientIp} :${m}`);
    if(m != ""){
      io.emit('chat message', `${cliIp}:${m}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${clientIp} has disconnected`)
    io.emit('system message', `SYSTEM:${cliIp} has left.`);

    conUsers -= 1;
    console.log(conUsers);

    if(conUsers == 1){
      io.emit('system message', `It looks like you are the only one here...`);
    }
    else{
      io.emit('system message', `There are now ${conUsers} people online`);
    }

  });
});

http.listen(port, () => {
  console.log(`listening on port*:${port}`);
});
