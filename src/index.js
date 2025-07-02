import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDifIfNotExists } from './utils/createDirIfNotExists.js';

async function bootstrap(params) {
  await initMongoConnection();
  await createDifIfNotExists(TEMP_UPLOAD_DIR);
  await createDifIfNotExists(UPLOAD_DIR);
  setupServer();
}

bootstrap();
