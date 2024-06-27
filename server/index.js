import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("submitAttendance", (attendanceData) => {
    console.log("Attendance received:", attendanceData);
    io.emit("updateAttendance", attendanceData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
