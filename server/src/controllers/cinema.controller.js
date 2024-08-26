import Cinema from "../models/cinema.model.js";

const getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.status(200).json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCinema = async (req, res) => {
  const { name, address, phone } = req.body;
  const cinema = new Cinema({ name, address, phone });

  try {
    const newCinema = await cinema.save();
    res.status(201).json(newCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (cinema) {
      res.status(200).json(cinema);
    } else {
      res.status(404).json({ message: "Cinema not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCinema = async (req, res) => {
  try {
    const updatedCinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCinema = async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cinema deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createCinema,
  deleteCinema,
  getCinemaById,
  updateCinema,
  getCinemas,
};
