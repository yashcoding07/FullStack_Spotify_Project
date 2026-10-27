import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ImageKit from "imagekit";
import app from "./src/app.js";
import _config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import musicModel from "./src/models/music.model.js";
import uploadFiles from "./src/services/storage.service.js";

async function runTests() {
  console.log("=== STEP 1: Connect to MongoDB ===");
  await connectDB();
  console.log("MongoDB connected successfully.\n");

  const ik = new ImageKit({
    publicKey: _config.IMAGEKIT_PUBLIC_KEY,
    privateKey: _config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: _config.URL_ENDPOINT,
  });

  const uploadedFileIds = [];

  try {
    console.log("=== STEP 2: Test storage.service.js uploadFiles ===");
    const dummyMusicFile = {
      buffer: Buffer.from("ID3 dummy mp3 audio stream test content"),
      originalname: "test-song.mp3",
      mimetype: "audio/mpeg",
    };
    const dummyCoverFile = {
      buffer: Buffer.from("GIF89a dummy image stream test content"),
      originalname: "test-cover.jpg",
      mimetype: "image/jpeg",
    };

    const directMusicResult = await uploadFiles(dummyMusicFile);
    console.log("Uploaded direct music to ImageKit:", {
      fileId: directMusicResult.fileId,
      name: directMusicResult.name,
      url: directMusicResult.url,
    });
    uploadedFileIds.push(directMusicResult.fileId);

    const directCoverResult = await uploadFiles(dummyCoverFile);
    console.log("Uploaded direct cover to ImageKit:", {
      fileId: directCoverResult.fileId,
      name: directCoverResult.name,
      url: directCoverResult.url,
    });
    uploadedFileIds.push(directCoverResult.fileId);

    console.log("Direct storage.service upload PASSED!\n");

    console.log("=== STEP 3: Test Express API Route POST /api/music/upload ===");
    const server = app.listen(0);
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    const artistId = new mongoose.Types.ObjectId();
    const artistUser = {
      id: artistId.toString(),
      role: "artist",
      fullName: {
        firstName: "TestArtistFirstName",
        lastName: "TestArtistLastName",
      },
    };
    const token = jwt.sign(artistUser, _config.JWT_SECRET, { expiresIn: "1h" });

    const formData = new FormData();
    formData.append("title", "Integration Test Track");
    formData.append(
      "music",
      new Blob([Buffer.from("dummy mp3 binary stream")], { type: "audio/mpeg" }),
      "test_track.mp3"
    );
    formData.append(
      "coverImage",
      new Blob([Buffer.from("dummy image binary stream")], { type: "image/png" }),
      "test_cover.png"
    );

    const response = await fetch(`http://localhost:${port}/api/music/upload`, {
      method: "POST",
      headers: {
        Cookie: `token=${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();
    console.log("POST /api/music/upload Response Status:", response.status);
    console.log("POST /api/music/upload Response Body:", JSON.stringify(responseData, null, 2));

    if (response.status !== 200) {
      throw new Error(`API test failed with status ${response.status}: ${JSON.stringify(responseData)}`);
    }

    if (responseData.music?.musicKey) {
      uploadedFileIds.push(responseData.music.musicKey);
    }
    if (responseData.music?.coverImageKey) {
      uploadedFileIds.push(responseData.music.coverImageKey);
    }

    console.log("\n=== STEP 4: Test Express API Route GET /api/music/artist-musics ===");
    const getResponse = await fetch(`http://localhost:${port}/api/music/artist-musics`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
    });

    const getResponseData = await getResponse.json();
    console.log("GET /api/music/artist-musics Response Status:", getResponse.status);
    console.log("GET /api/music/artist-musics Response Body:", JSON.stringify(getResponseData, null, 2));

    server.close();

    if (getResponse.status !== 200) {
      throw new Error(`GET /api/music/artist-musics failed: ${JSON.stringify(getResponseData)}`);
    }

    if (!Array.isArray(getResponseData.musics) || getResponseData.musics.length === 0) {
      throw new Error("Expected musics array to contain at least 1 song");
    }

    const fetchedSong = getResponseData.musics[0];
    if (!fetchedSong.musicUrl || !fetchedSong.coverImageUrl) {
      throw new Error("Song is missing musicUrl or coverImageUrl!");
    }

    console.log("\nURL verification successful:");
    console.log("Music URL:", fetchedSong.musicUrl);
    console.log("Cover Image URL:", fetchedSong.coverImageUrl);

    // Verify record in MongoDB
    if (responseData.music?._id) {
      const foundInDb = await musicModel.findById(responseData.music._id);
      console.log("\nVerified in MongoDB:", {
        id: foundInDb._id.toString(),
        title: foundInDb.title,
        artist: foundInDb.artist,
        artistId: foundInDb.artistId?.toString(),
        musicKey: foundInDb.musicKey,
        musicUrl: foundInDb.musicUrl,
        coverImageKey: foundInDb.coverImageKey,
        coverImageUrl: foundInDb.coverImageUrl,
      });

      // Cleanup MongoDB record
      await musicModel.findByIdAndDelete(responseData.music._id);
      console.log("Cleaned up test document from MongoDB.");
    }

    console.log("\nAll API and URL retrieval tests PASSED!");
  } finally {
    console.log("\n=== STEP 5: Clean up test files from ImageKit ===");
    for (const fileId of uploadedFileIds) {
      try {
        await ik.deleteFile(fileId);
        console.log(`Deleted ImageKit file: ${fileId}`);
      } catch (delErr) {
        console.error(`Failed to delete ImageKit file ${fileId}:`, delErr.message);
      }
    }

    await mongoose.disconnect();
    console.log("MongoDB disconnected. Test suite finished successfully.");
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
