import mongoose from "mongoose";
import unleaseModel from "../models/unleaseSchema.js";

export const createImages = async (req, res, next) => {
  const newUnlease = new unleaseModel(req.body);
  try {
    const savedRoom = await newUnlease.save();
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

export const getImages = async (req, res, next) => {
  try {
    const images = await unleaseModel.find();
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};

export const getOnlyImage = async (req, res, next) => {
  try {
    const data = await unleaseModel.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
export const getPopular = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const data = await unleaseModel.aggregate([
      // Unwind the popularPlaces array to deconstruct the nested documents
      { $unwind: "$popularPlaces" },
      // Match the document containing the specified nested ID
      {
        $match: {
          "popularPlaces._id": mongoose.Types.ObjectId.createFromHexString(
            req.params.id
          ),
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data[0]); // Return the first matched document
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getImagesByCategory = async (req, res, next) => {
  try {
    const category = req.params.category.toLowerCase();

    // Find entries by category
    const entries = await unleaseModel.find({
      category: { $regex: new RegExp("^" + category, "i") },
    });

    if (!entries || entries.length === 0) {
      return res
        .status(404)
        .json({ message: "No entries found for the specified category" });
    }
    res.status(200).json(entries); // Flatten the array before sending
  } catch (err) {
    next(err);
  }
};

export const getByPopularity = async (req, res, next) => {
  try {
    const popularity = req.params.popularity.toLowerCase();

    // Find entries by category
    const entries = await unleaseModel.find({
      popularity: { $regex: new RegExp("^" + popularity, "i") },
    });

    if (!entries || entries.length === 0) {
      return res
        .status(404)
        .json({ message: "No entries found for the specified category" });
    }
    res.status(200).json(entries); // Flatten the array before sending
  } catch (err) {
    next(err);
  }
};

export const getSearchUnlease = async (req, res) => {
  const query = req.query.q;

  try {
    const items = await unleaseModel.find({
      museumName: new RegExp(query, "i"),
    });

    res.json(items);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
