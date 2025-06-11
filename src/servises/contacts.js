import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => await ContactsCollection.find();

export const getContactById = async (id) =>
  await ContactsCollection.findById(id);

export const createContact = async (payload) =>
  await ContactsCollection.create(payload);

export const deleteContact = async (id) =>
  await ContactsCollection.findOneAndDelete({ _id: id });

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: id },
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
