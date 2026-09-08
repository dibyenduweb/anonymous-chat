import { compressImage } from "../utils/compressImage";

export const processImageForChat = async (file) => {
  return await compressImage(file, 800, 0.7);
};