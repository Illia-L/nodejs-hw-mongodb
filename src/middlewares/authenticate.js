import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const bearerToken = req.get('authorization');

  if (!bearerToken)
    return next(createHttpError(401, 'Please provide Authorization header'));

  const [bearer, token] = bearerToken.split(' ');

  console.log({bearer, token});

  if (!bearer || !token)
    return next(createHttpError(401, 'Auth header should be of type Bearer'));

  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) return next(createHttpError(401, 'Session not found'));

  const isTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

  if (isTokenExpired) return next(createHttpError(401, 'Access token expired'));

  const user = await UsersCollection.findById(session.userId);

  if (!user) return next(createHttpError(401));

  req.user = user;

  next();
};
