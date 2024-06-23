import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import routes from "./src/routes/index.js";
import seatModel from "./src/models/seat.model.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://web-film-eosin.vercel.app", //  http://localhost:3000
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
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("blockSeat", async ({ seatNumber, showtime, cinemaId, date }) => {
    console.log(
      "received blockSeat event for seat number:",
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
      const seatDoc = await seatModel.findOne({
        seatNumber,
        cinemaId,
        showtime,
        date,
      });

      if (!seatDoc) {
        console.error("Seat document not found");
        return;
      }

      const seatExists = seatDoc.seats.some(
        (seat) => seat.number === seatNumber
      );
      if (!seatExists) {
        console.error("Seat not found in the document");
        return;
      }

      const updatedSeat = await seatModel.findOneAndUpdate(
        { cinemaId, showtime, date, "seats.number": seatNumber },
        { $set: { "seats.$.status": "booked" } },
        { new: true }
      );

      console.log("updatedSeat: ", updatedSeat);
      if (updatedSeat) {
        io.emit("seatBlocked", { seatNumber, showtime, cinemaId, date });
      }
    } catch (error) {
      console.error("Error updating seat status:", error);
    }
  });
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
