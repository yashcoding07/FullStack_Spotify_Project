import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  musicKey: {
    type: String,
    required: true,
  },
  musicUrl: {
    type: String,
  },
  coverImageKey: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String,
  },
}, { timestamps: true });

const musicModel = mongoose.model('Music', musicSchema);

export default musicModel;
