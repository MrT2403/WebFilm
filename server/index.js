import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";
import MoMoService from "./src/services/momo.js";
import cinemaModel from "./src/models/cinema.model.js";
import fs from "fs";

const app = express();

// Configure CORS
const corsOptions = {
  origin: "https://web-film-eosin.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routes);

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log("New WebSocket client connected");

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const { MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY } = process.env;
    if (!MOMO_PARTNER_CODE || !MOMO_ACCESS_KEY || !MOMO_SECRET_KEY) {
      throw new Error("MoMo configuration environment variables are missing");
    }

    const momoService = new MoMoService(
      MOMO_PARTNER_CODE,
      MOMO_ACCESS_KEY,
      MOMO_SECRET_KEY
    );
    console.log(momoService);

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    try {
      fs.readFile("cinema.json", "utf-8", (err, jsonData) => {
        if (err) {
          console.error("Error reading file:", err);
          process.exit(1);
        }
        const data = JSON.parse(jsonData);
        cinemaModel
          .insertMany(data)
          .then(() => {
            console.log("Data imported successfully.");
            process.exit();
          })
          .catch((error) => {
            console.error("Error inserting data:", error);
            process.exit(1);
          });
      });
    } catch (error) {
      console.error("Error importing data:", error);
      process.exit(1);
    }
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

importData();
