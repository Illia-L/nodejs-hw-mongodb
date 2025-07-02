import fs from 'node:fs/promises';

export const createDifIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') await fs.mkdir(url);
  }
};
