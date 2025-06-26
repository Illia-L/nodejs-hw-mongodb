import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  filter.userId = userId;

  const filterQuery = ContactsCollection.find(filter);

  if (filter.contactType !== undefined)
    filterQuery.where('contactType').equals(filter.contactType);

  if (filter.isFavourite !== undefined)
    filterQuery.where('isFavourite').equals(filter.isFavourite);

  const countQuery = ContactsCollection.countDocuments().merge(filterQuery);

  const contactsQuery = filterQuery
    .clone()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  const [count, contacts] = await Promise.all([countQuery, contactsQuery]);

  const paginationData = calculatePaginationData(count, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) =>
  await ContactsCollection.findOne({ contactId, userId });

export const createContact = async (payload) =>
  await ContactsCollection.create(payload);

export const deleteContact = async (contactId, userId) =>
  await ContactsCollection.findOneAndDelete({ _id: contactId, userId });

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
