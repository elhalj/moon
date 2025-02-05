import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { routesAuth } from "./routes/auth.user.routes.js";
import { connectDb } from "./database/db.js";
import { authMessage } from "./routes/auth.message.routes.js";
import { server, app } from "./lib/socket.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)

const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();

app.use(express.json());
app.use(bodyParser.json({limit:'10mb'}));
app.use(bodyParser.urlencoded({limit:'10mb', extended:true}));
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use('/api/auth',routesAuth);
app.use('/api/message',authMessage);

app.use(express.static(path.join(__dirname,'../client/dist')))

app.get('*', (req, res) => res.sendFile(path.join(__dirname,'../client/dist/index.html')))


server.listen(5001, () => {
  console.log("server is running on port", + PORT);
  connectDb();
});
