import { Client } from '../models/Client.js';

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    return res.json(clients);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Client name is required' });

    const newClient = new Client({
      name,
      contactName: name,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com`,
      phone: phone || '+91 98765 00000',
      company: company || name,
      status: status || 'Active'
    });

    await newClient.save();
    return res.status(201).json(newClient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
