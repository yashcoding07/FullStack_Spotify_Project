import express from "express";
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as musicMiddlewares from "../middlewares/music.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/upload",
  musicMiddlewares.musicMiddlewareArtist,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  musicController.uploadMusic,
);

router.get(
  "/artist-musics",
  musicMiddlewares.musicMiddlewareArtist,
  musicController.getArtistMusics,
);

router.post(
  "/playlist",
  musicMiddlewares.musicMiddlewareArtist,
  musicController.createPlaylist,
);

router.get(
  "/playlist",
  musicMiddlewares.musicMiddlewareUser,
  musicController.getPlaylist,
);

router.get(
  "/",
  musicMiddlewares.musicMiddlewareUser,
  musicController.getAllMusics,
);

router.get(
  "/playlist/:id",
  musicMiddlewares.musicMiddlewareUser,
  musicController.getPlaylistById,
);

router.get(
  "/get-details/:id",
  musicMiddlewares.musicMiddlewareUser,
  musicController.getMusicById,
);

export default router;
