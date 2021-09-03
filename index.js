var express=require('express')
var http=require("http")
var app=express()
var port=process.env.port||8080
var httpserver=http.createServer(app);
const {Server}=require("socket.io")
const io=new Server(httpserver)
var users={}
app.use("/",express.static("public"))
app.get("/")
io.on("connection", (socket) => {
  socket.on("user-connected", (ClientName) => {
    users[socket.id] = ClientName;
    socket.broadcast.emit("New-client-connected",`${ClientName} joined the chat`)
  });
  socket.on("InputMessage", (data) => {
    socket.broadcast.emit("RecieveInput",`${users[socket.id]} : ${data}`);
  });
  socket.on("disconnect", (data) =>{socket.broadcast.emit("user-disconnected",`${users[socket.id]} left the chat`);
delete users[socket.id]}
  );
});
app.use((req,res)=>{
    res.sendFile(__dirname+"/public/error.html")})
httpserver.listen(port)