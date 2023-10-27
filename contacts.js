const fs = require("fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === contactId);
  if (contact) {
    return contact;
  }
  return null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const newContact = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];

  await fs.writeFile(contactsPath, JSON.stringify(newContact, null, 2));

  return contacts[index];
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
