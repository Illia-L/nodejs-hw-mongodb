import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../servises/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseQueryParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseQueryParams(req.query);

  const responseData = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  const responseBody = {
    status: 200,
    message: 'Successfully found contacts!',
    data: responseData,
  };

  res.status(200).json(responseBody);
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) throw createHttpError(404, 'Contact not found');

  const responseBody = {
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  };

  res.status(200).json(responseBody);
};

export const createContactController = async (req, res) => {
  console.log({userId:req.user._id});
  const contact = await createContact({ userId: req.user._id, ...req.body });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.contactId, req.user._id);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};

export const updateContactController = async (req, res) => {
  const result = await updateContact(
    req.params.contactId,
    req.user._id,
    req.body,
  );

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
