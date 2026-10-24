import express from 'express';
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as musicMiddlewares from "../middlewares/music.middleware.js";

const upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

router.post("/upload", musicMiddlewares.musicMiddleware, upload.fields([
    { name: 'music', maxCount: 1},
    { name: 'coverImage', maxCount: 1}
]), musicController.uploadMusic);

export default router;