import { v2 as cloudinary, } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_PROJECTNAME, CLOUDINARY_SECRET_KEY, } from "./env.js";
cloudinary.config({
    cloud_name: CLOUDINARY_PROJECTNAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
    secure: true,
});
export function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            asset_folder: "bookkart",
            use_asset_folder_as_public_id_prefix: true,
        }, (error, uploadResult) => {
            if (error) {
                return reject(error);
            }
            return resolve(uploadResult);
        });
        if (!file) {
            console.log("file is not empty");
            return;
        }
        stream.end(file);
    });
}
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        return error;
        console.error(error);
    }
};
