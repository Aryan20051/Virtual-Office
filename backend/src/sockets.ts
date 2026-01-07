import { Server } from "socket.io";

export function setupSockets(io: Server) {
  io.on("connection", socket => {
    socket.on("online", userId => {
      io.emit("user-online", userId);
    });

    socket.on("disconnect", () => {
      io.emit("user-offline");
    });
  });
}
