import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import path from 'node:path';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async (file) => {
  console.log({ TEMP_UPLOAD_DIR, UPLOAD_DIR, file });
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${getEnvVar('DOMAIN_NAME')}/uploads/${file.filename}`;
};
