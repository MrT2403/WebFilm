import mongoose from "mongoose";
import fs from "fs";
import cinemaModel from "./src/models/cinema.model.js";

const importData = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("Mongodb connected");
      })
      .catch((err) => {
        console.error("Error connecting to database:", err);
        process.exit(1);
      });
    try {
      const jsonData = fs.readFileSync("./cinema.json");
      const data = JSON.parse(jsonData);
      await cinemaModel.insertMany(data);
      console.log("Data imported successfully.");
      process.exit();
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
