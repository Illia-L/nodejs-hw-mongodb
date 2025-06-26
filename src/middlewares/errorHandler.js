import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') return devErrorHandler(err, res);

  prodErrorHandler(err, res);
};

const prodErrorHandler = (err, res) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.name,
      data: err,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

const devErrorHandler = (err, res) => {
  console.log('+++++++++++++++++++++++++++++++++++++++');
  console.log(err);
  console.log('---------------------------------------');
  res.status(500).json({ message: err.message, stack: err.stack });
};
