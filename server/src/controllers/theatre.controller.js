import theatre from "../models/theatre.model.js";

const getNearbyTheatres = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    let nearbyTheatres;
    if (lat && lng) {
      nearbyTheatres = await theatre
        .aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)],
              },
              distanceField: "distance",
              maxDistance: 10000,
              spherical: true,
            },
          },
          { $match: { is_active: true } },
        ])
        .exec();
    } else {
      nearbyTheatres = await theatre.find({ is_active: true }).exec();
    }

    res.status(200).json(nearbyTheatres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTheatre = async (req, res) => {
  try {
    const {
      name,
      address,
      lat,
      lng,
      phone_number,
      email,
      description,
      room_summary,
      opening_hours,
      rooms,
      thumbnail,
      cover,
    } = req.body;

    const theatre = new theatre({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      phone_number,
      email,
      description,
      room_summary,
      opening_hours,
      rooms,
      thumbnail,
      cover,
    });

    const savedTheatre = await theatre.save();

    res.status(201).json(savedTheatre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getNearbyTheatres, addTheatre };
