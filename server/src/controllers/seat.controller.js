import seatModel from "../models/seat.model.js";

const blockSeats = async (req, res) => {
  const { cinemaId, showtime, date, seats } = req.body;

  try {
    let seatData = await seatModel.findOne({ cinemaId, showtime, date });

    if (!seatData) {
      seatData = new seatModel({ cinemaId, showtime, date, seats: [] });
    }
    console.log("seatData: ", seatData);
    seats.forEach((seatNumber) => {
      const existingSeat = seatData.seats.find(
        (seat) => seat.number === seatNumber
      );
      if (existingSeat) {
        existingSeat.status = "booked";
      } else {
        seatData.seats.push({ number: seatNumber, status: "booked" });
      }
    });

    await seatData.save();
    res.status(200).json({ message: "Seats successfully blocked" });
  } catch (error) {
    res.status(500).json({ message: "Failed to block seats", error });
  }
};

const getBlockedSeats = async (req, res) => {
  const { cinemaId, showtime, date } = req.query;

  try {
    const seatData = await seatModel.findOne({ cinemaId, showtime, date });

    if (!seatData) {
      return res.status(200).json({ blockedSeats: [] });
    }

    const blockedSeats = seatData.seats
      .filter((seat) => seat.status === "booked")
      .map((seat) => seat.number);

    res.status(200).json({ blockedSeats });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blocked seats", error });
  }
};

const seatStatus = async (req, res) => {
  const { cinemaId, showtime, date } = req.query;

  try {
    const seatRecord = await Seat.findOne({ cinemaId, showtime, date });

    if (seatRecord) {
      res.status(200).json(seatRecord);
    } else {
      res.status(404).json({ message: "No seat information found" });
    }
  } catch (error) {
    console.error("Error fetching seat status:", error);
    res.status(500).json({ error: "Failed to fetch seat status" });
  }
};

const seatBook = async (req, res) => {
  const { cinemaId, showtime, date, seats } = req.body;

  try {
    const seatRecord = await seatModel.findOne({ cinemaId, showtime, date });

    if (seatRecord) {
      seats.forEach((seatNumber) => {
        const seat = seatRecord.seats.find((s) => s.number === seatNumber);
        if (seat) {
          seat.status = "booked";
        }
      });
      await seatRecord.save();
    } else {
      const newSeatRecord = new seatModel({
        cinemaId,
        showtime,
        date,
        seats: seats.map((seatNumber) => ({
          number: seatNumber,
          status: "booked",
        })),
      });
      await newSeatRecord.save();
    }

    res.status(200).json({ message: "Seats booked successfully" });
  } catch (error) {
    console.error("Error booking seats:", error);
    res.status(500).json({ error: "Failed to book seats" });
  }
};

export default { blockSeats, getBlockedSeats, seatStatus, seatBook };
