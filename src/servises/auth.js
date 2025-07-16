import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import {
  FIFTEEN_MINUTES,
  FIVE_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import {
  getFullNameFromGoogleTokenPayload,
  verifyCode,
} from '../utils/googleOAuth2.js';

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

  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

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

export const sendResetToken = async (email) => {
  const user = UsersCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: FIVE_MINUTES },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');

    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
  });

  if (!user) throw createHttpError(404, 'User not found.');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.findOneAndUpdate(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionsCollection.findOneAndDelete({ userId: user._id });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await verifyCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  const email = { payload };

  let user = await UsersCollection.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    const name = getFullNameFromGoogleTokenPayload(payload);

    user = UsersCollection.create({
      name,
      email,
      password,
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
