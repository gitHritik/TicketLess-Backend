import express from "express";
import {
  createImages,
  getImages,
  getOnlyImage,
  getPopular,
  getSearch,
  getSearchLocation,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/scroller", createImages);
router.get("/scroller", getImages);
router.get("/singleImage/:id", getOnlyImage);
router.get("/popular/:id", getPopular);
router.get("/search", getSearch);
router.get("/searchLocation", getSearchLocation);

export default router;
