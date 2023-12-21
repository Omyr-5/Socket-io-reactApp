const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io")
const cors = require("cors")

app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {

    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]

    }
})

io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        if (data) {
            socket.emit("status", socket.id)
        }
        socket.join(data)
    });

    socket.on("send_message", (data) => {

        socket.to(data.room).emit("receive_message", data.message)
    });

})

server.listen(3001, () => {
    console.log("Server is running!!")
})