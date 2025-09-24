import imageModel from "../models/imageSchema.js";
import mongoose from "mongoose";

export const createImages = async (req, res, next) => {
  const newRoom = new imageModel(req.body);
  try {
    const savedRoom = await newRoom.save();
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

export const getImages = async (req, res, next) => {
  try {
    const images = await imageModel.find();
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};

export const getOnlyImage = async (req, res, next) => {
  try {
    const data = await imageModel.findById(req.params.id);
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
    const data = await imageModel.aggregate([
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

export const getSearch = async (req, res) => {
  const query = req.query.q;
  try {
    const items = await imageModel.find({ museumName: new RegExp(query, "i") });

    res.json(items);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getSearchLocation = async (req, res) => {
  const query = req.query.q;
  try {
    const items = await imageModel.find({ location: new RegExp(query, "i") });

    res.json(items);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
