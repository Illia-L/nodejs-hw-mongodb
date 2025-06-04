import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './servises/contacts.js';

const PORT = Number(getEnvVar('PORT', '3000'));

const app = express();

app.get('/contacts', async (req, res) => {
  const contacts = await getAllContacts();
  const responseBody = {
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  };

  res.status(200).json(responseBody);
});

app.get('/contacts/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) return res.status(404).json({ message: 'Contact not found' });

  const responseBody = {
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  };

  res.status(200).json(responseBody);
});

export function setupServer() {
  app.use(cors());
  app.use(express.json());
  app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  });

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
