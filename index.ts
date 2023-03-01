// @ts-nocheck
const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const SocketEvent = {
  NEW_USER: "new-user",
  NEW_MESSAGE: "new-message",
  NEW_NOTIFICATION: "new-notification",
};

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("user connected:", socket.id);

  //take userId and socketId from user
  socket.on(SocketEvent.NEW_USER, (userId) => {
    addUser(+userId, socket.id);

    // io.emit("GET_USERS", users);
  });

  //send and get message
  socket.on(SocketEvent.NEW_MESSAGE, (message) => {
    const user = getUser(message.receiver.id);

    if (!user) {
      return;
    }

    io.to(user.socketId).emit(SocketEvent.NEW_MESSAGE, message);
  });

  socket.on(SocketEvent.NEW_NOTIFICATION, (notifierId) => {
    const user = getUser(notifierId);

    if (!user) {
      return;
    }

    io.to(user.socketId).emit(SocketEvent.NEW_NOTIFICATION);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    // io.emit("GET_USERS", users);
  });
});
