import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const users = {};

  io.on("connection", (socket) => {
    socket.on("join", ({ username, socketId }) => {
      users[username] = socketId;
      console.log(users);
      io.emit("join", users);
    });
    socket.on("disconnect", (reason) => {
      const username = Object.keys(users).find(
        (key) => users[key] === socket.id
      );
      delete users[username];
      console.log(users);
      io.emit("leave", users);
    });
    socket.on("message", (message) => {
      if (message.recipient) {
        io.to(message.recipient).emit("message", message);

        if (message.recipient !== message.senderSocket)
          socket.emit("message", message);
      } else {
        io.emit("message", message);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
