import uploadFiles from "../services/storage.service.js";
import musicModel from "../models/music.model.js";

export async function uploadMusic(req, res) {
    const musicFile = req.files?.['music']?.[0];
    const coverImageFile = req.files?.['coverImage']?.[0];

    if (!musicFile || !coverImageFile) {
        return res.status(400).json({ message: "Both music and coverImage files are required" });
    }

    if (!req.body.title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try{
        const musicUpload = await uploadFiles(musicFile);
        const coverImageUpload = await uploadFiles(coverImageFile);

        const music = await musicModel.create({
            title: req.body.title,
            artist: req.user?.fullName?.firstName
                ? `${req.user.fullName.firstName} ${req.user.fullName.lastName || ''}`.trim()
                : (req.user?.artist || 'Unknown Artist'),
            artistId: req.user?.id || req.user?._id,
            musicKey: musicUpload.fileId || musicUpload.url || musicUpload,
            coverImageKey: coverImageUpload.fileId || coverImageUpload.url || coverImageUpload
        });

        return res.status(200).json({ message: "Music uploaded successfully", music });
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
