//Server
let express = require("express");
let app = express();

let http = require("http");
let server = http.Server(app);

let socketIO = require("socket.io");
let io = socketIO(server);
let transcript = [];
let adList = [];

const port = process.env.PORT || 3000;
app.get('/', (req, res)=>{
  res.send('<h1>This is Socket.io-Server</h1>');
})
//Make Coonection
io.on("connection", (socket) => {
  console.log("Socket pa aa gya bnda🤑")
  socket.on("join", (data) => {
    socket.join(data.room);
    console.log("user joined server ", { data });
    socket.broadcast.to(data.room).emit("user joined ok!");
  });
  //This will calls on ad
  socket.on("ad", (data) => {
    adList.push(data);
    console.log(adList);
    socket.broadcast.emit("adList", adList);
    socket.emit("adList", adList);
  });
  //This will calls on message
  socket.on("message", (data) => {
    transcript.push(data);
    console.log(data);
    socket.broadcast.emit("new message", data);
    socket.emit("new message", data);
  });

  // Functions are called on every reload
  socket.emit("new message", { transcript });
  socket.emit("adList", adList);

  socket.on("disconnect", () => {
    console.log("Socket sy chala gya bnda!😪");
  });
});

// Server listening on port
server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
