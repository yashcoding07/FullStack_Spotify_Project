import uploadFiles, { getFileDetails } from "../services/storage.service.js";
import musicModel from "../models/music.model.js";
import playlistModel from "../models/playlist.model.js";

export async function uploadMusic(req, res) {
  const musicFile = req.files?.["music"]?.[0];
  const coverImageFile = req.files?.["coverImage"]?.[0];

  if (!musicFile || !coverImageFile) {
    return res
      .status(400)
      .json({ message: "Both music and coverImage files are required" });
  }

  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const musicUpload = await uploadFiles(musicFile);
    const coverImageUpload = await uploadFiles(coverImageFile);

    const music = await musicModel.create({
      title: req.body.title,
      artist: req.user?.fullName?.firstName
        ? `${req.user.fullName.firstName} ${req.user.fullName.lastName || ""}`.trim()
        : req.user?.artist || "Unknown Artist",
      artistId: req.user?.id || req.user?._id,
      musicKey: musicUpload.fileId,
      musicUrl: musicUpload.url,
      coverImageKey: coverImageUpload.fileId,
      coverImageUrl: coverImageUpload.url,
    });

    return res
      .status(200)
      .json({ message: "Music uploaded successfully", music });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getArtistMusics(req, res) {
  try {
    const artistId = req.user?.id || req.user?._id;
    const musics = await musicModel.find({ artistId }).lean();

    // If any song was stored without musicUrl or coverImageUrl, resolve them via ImageKit
    const musicsWithUrls = await Promise.all(
      musics.map(async (song) => {
        let musicUrl = song.musicUrl;
        let coverImageUrl = song.coverImageUrl;

        if (!musicUrl && song.musicKey) {
          try {
            const details = await getFileDetails(song.musicKey);
            musicUrl = details.url;
          } catch (e) {
            console.error(
              `Failed to get URL for musicKey ${song.musicKey}:`,
              e.message,
            );
          }
        }

        if (!coverImageUrl && song.coverImageKey) {
          try {
            const details = await getFileDetails(song.coverImageKey);
            coverImageUrl = details.url;
          } catch (e) {
            console.error(
              `Failed to get URL for coverImageKey ${song.coverImageKey}:`,
              e.message,
            );
          }
        }

        return {
          ...song,
          musicUrl,
          coverImageUrl,
        };
      }),
    );

    return res.status(200).json({ musics: musicsWithUrls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPlaylist(req, res) {
  const { title, musics } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Playlist title is required" });
  }

  try {
    const artistName = req.user?.fullName?.firstName
      ? `${req.user.fullName.firstName} ${req.user.fullName.lastName || ""}`.trim()
      : req.user?.artist || req.user?.email || "Unknown Artist";

    const playlist = await playlistModel.create({
      artist: artistName,
      artistId: req.user?.id || req.user?._id,
      title,
      musics: musics || [],
    });

    const populated = await playlistModel
      .findById(playlist._id)
      .populate("musics");

    return res
      .status(200)
      .json({ message: "Playlist created successfully", playlist: populated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPlaylist(req, res) {
  try {
    const filter = req.query.mine ? { artistId: req.user?.id || req.user?._id } : {};
    const playlists = await playlistModel.find(filter).populate("musics").lean();
    return res.status(200).json(playlists);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllMusics(req, res) {
  const { skip = 0, limit = 50 } = req.query;

  try {
    const musics = await musicModel
      .find()
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    return res
      .status(200)
      .json({ message: "Musics fetched successfully", musics });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPlaylistById(req, res) {
  const { id } = req.params;

  try {
    const playlistDoc = await playlistModel.findById(id).populate("musics").lean();

    if (!playlistDoc) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ playlist: playlistDoc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMusicById(req, res) {
  const { id } = req.params;

  try {
    const music = await musicModel.findById(id).lean();

    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    return res.status(200).json({ music });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
