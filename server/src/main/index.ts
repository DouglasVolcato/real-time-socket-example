import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const http = createServer(app);
const io = new Server(http);

io.on("connection", (socket) => {
  console.log("User disconnected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", (data) => {
    console.log("Received message: ", data);
    io.emit("send", data);
  });
});

const PORT = 3001;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
