import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../servises/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  const responseBody = {
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  };

  res.status(200).json(responseBody);
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  const responseBody = {
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  };

  res.status(200).json(responseBody);
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contact = await deleteContact(req.params.contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};

export const updateContactController = async (req, res, next) => {
  const result = await updateContact(req.params.contactId, req.body);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
