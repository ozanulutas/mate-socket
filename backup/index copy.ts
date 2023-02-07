// @ts-nocheck

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 8000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
let users: any = [];

socketIO.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socketIO.emit("evt1", 666);
  socketIO.emit("evt2", 666);

  socket.on("message", (data: any) => {
    socket.emit("messageResponse", data);
  });

  socket.on("typing", (data: any) =>
    socket.broadcast.emit("typingResponse", data)
  );

  socket.on("newUser", (data: any) => {
    users.push(data);
    socket.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user: any) => user.socketID !== socket.id);
    socket.emit("newUserResponse", users);
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
