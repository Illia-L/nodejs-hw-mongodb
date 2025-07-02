const parseNumber = (value, defaultValue) => {
  const isString = typeof value === 'string';

  if (!isString) return defaultValue;

  const valueParsedToNumber = parseInt(value);
  const isNaN = Number.isNaN(valueParsedToNumber);

  if (isNaN) return defaultValue;

  return valueParsedToNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return { page: parsedPage, perPage: parsedPerPage };
};
