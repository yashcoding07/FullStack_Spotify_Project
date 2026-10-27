import imagekit from "imagekit";
import mongoose from "mongoose";
import _config from "../config/config.js";

const imagekitVariables = new imagekit({
    publicKey: _config.IMAGEKIT_PUBLIC_KEY,
    privateKey: _config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: _config.URL_ENDPOINT 
});

function uploadFiles(file){
    return new Promise((res, rej) => {
        imagekitVariables.upload({
            file: file.buffer,
            fileName: new mongoose.Types.ObjectId().toString(),
            folder: "Spotify-piper"
        }, (err, result) => {
            if(err){
                rej(err);
            }else{
                res(result);
            }
        })
    })
}

export async function getFileDetails(fileId) {
    return imagekitVariables.getFileDetails(fileId);
}

export { imagekitVariables };
export default uploadFiles;
