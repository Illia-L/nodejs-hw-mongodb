const parseType = (type) =>
  ['work', 'home', 'personal'].includes(type) ? type : undefined;

const parseFavourite = (isFavourite) =>
  ['true', 'false'].includes(isFavourite)
    ? isFavourite === 'true'
      ? true
      : false
    : undefined;

export const parseQueryParams = (params) => {
  const { type: contactType, isFavourite } = params;
  const parsedParams = {};

  const parsedContactType = parseType(contactType);
  const parsedIsFavourite = parseFavourite(isFavourite);

  if (parsedContactType) parsedParams.contactType = parsedContactType;
  if (parsedIsFavourite) parsedParams.isFavourite = parsedIsFavourite;

  return parsedParams;
};
