import express, { json } from "express";
import { Server } from "socket.io";
import dbConnection from "./Config/dbConfig.js";
import cors from "cors";
import path from "path";
import userRouter from "./Routes/User.js";
import adminRouter from "./Routes/Admin.js";
import partnerRouter from "./Routes/Partner.js";
import { Socket } from "socket.io";
import http from "http";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(json());

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/partner", partnerRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://carrenatlserviesss.netlify.app",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


httpServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("message", (message) => {
    console.log("Message:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});
