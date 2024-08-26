import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import routes from "./src/routes/index.js";
import seatModel from "./src/models/seat.model.js";
// import fs from "fs";
// import cinemaModel from "./src/models/cinema.model.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://web-film-eosin.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", cors(corsOptions), routes);

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("selectSeat", ({ seatNumber, showtime, cinemaId, date }) => {
    console.log(
      "Received selectSeat event for seat number:",
      seatNumber,
      "showtime:",
      showtime,
      "cinemaId:",
      cinemaId,
      "date:",
      date
    );
  });

  socket.on(
    "confirmBlockSeat",
    async ({ seatNumber, showtime, cinemaId, date }) => {
      console.log(
        "Received confirmBlockSeat event for seat number:",
        seatNumber,
        "showtime:",
        showtime,
        "cinemaId:",
        cinemaId,
        "date:",
        date
      );

      if (!seatNumber || !showtime || !cinemaId || !date) {
        console.error("Invalid data received");
        return;
      }

      try {
        let seatDoc = await seatModel.findOne({
          cinemaId,
          showtime,
          date,
        });

        if (!seatDoc) {
          console.log("Seat document not found, creating a new one");
          seatDoc = new seatModel({
            cinemaId,
            showtime,
            date,
            seats: [],
          });
          await seatDoc.save();
        }

        const seatExists = seatDoc.seats.some(
          (seat) => seat.number === seatNumber
        );

        if (!seatExists) {
          console.error("Seat not found in the document, adding it");
          seatDoc.seats.push({ number: seatNumber, status: "available" });
          await seatDoc.save();
        }

        // Update the seat status
        const updatedSeat = await seatModel.findOneAndUpdate(
          { cinemaId, showtime, date, "seats.number": seatNumber },
          { $set: { "seats.$.status": "booked" } },
          { new: true }
        );

        console.log("Updated seat:", updatedSeat);
        if (updatedSeat) {
          io.emit("seatBlocked", { seatNumber, showtime, cinemaId, date });
          console.log("Emitting seatBlocked event");
        }
      } catch (error) {
        console.error("Error updating seat status:", error);
      }
    }
  );
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

// const importData = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");

//     try {
//       fs.readFile("cinema.json", "utf-8", (err, jsonData) => {
//         if (err) {
//           console.error("Error reading file:", err);
//           process.exit(1);
//         }
//         const data = JSON.parse(jsonData);
//         cinemaModel
//           .insertMany(data)
//           .then(() => {
//             console.log("Data imported successfully.");
//             process.exit();
//           })
//           .catch((error) => {
//             console.error("Error inserting data:", error);
//             process.exit(1);
//           });
//       });
//     } catch (error) {
//       console.error("Error importing data:", error);
//       process.exit(1);
//     }
//   } catch (err) {
//     console.error("Error connecting to database:", err);
//     process.exit(1);
//   }
// };

// importData();
