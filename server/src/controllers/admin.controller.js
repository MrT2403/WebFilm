import Movie from "../models/Movie";
import User from "../models/User";
import Transaction from "../models/Transaction";
import WebsiteStats from "../models/WebsiteStats";

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    handleServerError(res, error);
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, description, genre } = req.body;
    const newMovie = new Movie({ title, description, genre });
    await newMovie.save();
    res.json({ message: "Movie created successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre } = req.body;
    await Movie.findByIdAndUpdate(id, { title, description, genre });
    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    await User.findByIdAndUpdate(id, { username, email });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    res.json(transaction);
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getWebsiteStats = async (req, res) => {
  try {
    const stats = await WebsiteStats.find();
    res.json(stats);
  } catch (error) {
    handleServerError(res, error);
  }
};

export default {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  getWebsiteStats,
};
