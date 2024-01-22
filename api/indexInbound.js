import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());

const uri = "mongodb+srv://Admin:NodesAdvisors2024@dev.jq8me.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'dev';
const InboundCollectionName = 'InboundEmails';

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit in case of connection failure
  }
}

app.get('/', async (req, res) => {
  const { q } = req.query;
  const keys = ['subject', 'sender', 'isInvestorEmail', 'isInterested', 'deckRequested', 'meetingRequested', 'proposalAccepted'];

  const searchQuery = q ? {
    $or: keys.map(key => ({ [key]: new RegExp(q, 'i') }))
  } : {};

  try {
    const database = client.db(dbName);
    const inboundCollection = database.collection(InboundCollectionName);

    const inboundEmails = await inboundCollection.find(searchQuery).limit(100).toArray();
    res.json(inboundEmails);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


app.get('/employees', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('Employees');
    const employees = await collection.find({}).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.get('/fundcard', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('FundCard');
    const employees = await collection.find({}).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.get('/inboundemails', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('InboundEmails');
    const employees = await collection.find({}).limit(500).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.get('/kpisInfo', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('KPIsInfo');
    const employees = await collection.find({}).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.get('/outboundEmails', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('OutboundEmails');
    const employees = await collection.find({}).limit(500).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});



app.listen(5001, async () => {
  console.log('API is working!');
  await connectToMongoDB();
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB disconnected on app termination');
  process.exit(0);
});

