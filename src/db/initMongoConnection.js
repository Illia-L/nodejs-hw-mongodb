import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection() {
  try {
    const USER = getEnvVar('MONGODB_USER');
    const PWD = getEnvVar('MONGODB_PASSWORD');
    const URL = getEnvVar('MONGODB_URL');
    const DB = getEnvVar('MONGODB_DB');
    const connectionString = `mongodb+srv://${USER}:${PWD}@${URL}/${DB}?
    retryWrites=true&w=majority`;

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('An error occured while connecting to database.', err);
    throw err;
  }
}
