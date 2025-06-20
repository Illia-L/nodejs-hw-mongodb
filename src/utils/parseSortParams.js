import { SORT_ORDER } from '../constants/index.js';

const keyOfContacts = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

const parseSortOrder = (order) =>
  [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(order) ? order : SORT_ORDER.ASC;

const parseSortBy = (sortBy) =>
  keyOfContacts.includes(sortBy) ? sortBy : '_id';

export const parseSortParams = (query = {}) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
