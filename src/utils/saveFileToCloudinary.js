import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'node:fs/promises';

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.CLOUD_KEY),
  api_secret: getEnvVar(CLOUDINARY.CLOUD_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);

  await fs.unlink(file.path);

  return response.secure_url;
};
