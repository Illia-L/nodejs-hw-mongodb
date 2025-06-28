import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const registerUser = async (payload) => {
  const isEmailRegistered = await UsersCollection.findOne({
    email: payload.email,
  });

  if (isEmailRegistered) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return user;
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  console.log({user});

  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordCorrect = bcrypt.compare(payload.password, user.password);

  if (!isPasswordCorrect) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user.id });

  const newSession = createSession();

  const newSessionData = {
    userId: user.id,
    ...newSession,
  };

  const session = await SessionsCollection.create(newSessionData);

  return session;
};

export const logoutUser = async (sessionId) =>
  await SessionsCollection.findByIdAndDelete(sessionId);

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const currentSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!currentSession) throw createHttpError(404, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(404, 'Session token expired');

  const newSessionData = createSession();

  await SessionsCollection.findByIdAndDelete(sessionId);

  const newSession = await SessionsCollection.create({
    userId: currentSession.userId,
    ...newSessionData,
  });

  return newSession;
};
