////////////////// Connect through API using emails.js

// import express from "express";
// const app = express();
// import { Emails } from "./emails.js";
// import cors from "cors";

// app.use(cors());

// app.get("/", (req, res) => {
//   const { q } = req.query;

//   const keys = ["subject", "sender", "toRecipients"];

//   const search = (data) => {
//     return data.filter((item) =>
//       keys.some((key) => item[key].toLowerCase().includes(q))
//     );
//   };

//   q ? res.json(search(Emails).slice(0, 10)) : res.json(Emails.slice(0, 10));
// });

// app.listen(5001, () => console.log("API is working!"));


///////////////////////// Connect through MongoDB
// import express from 'express';
// import { MongoClient } from 'mongodb';
// import cors from 'cors';

// const app = express();
// app.use(cors());

// const uri = 'mongodb+srv://GraceLTQ:Apple_030711@outboundemailcluster.xapxelz.mongodb.net/';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Replace 'your-database-name' and 'your-collection-name' with your actual database and collection names
// const dbName = 'OutboundEmailCluster';
// const collectionName = 'emaildata';

// async function run() {
//   try {
//     await client.connect();
//     console.log('Connected successfully to MongoDB');

//     const database = client.db(dbName);
//     const collection = database.collection(collectionName);

//     app.get('/', async (req, res) => {
//       const { q } = req.query;
//       const keys = ['subject', 'sender', 'toRecipients'];

//       const searchQuery = q ? {
//         $or: keys.map(key => ({ [key]: new RegExp(q, 'i') }))
//       } : {};

//       try {
//         const emails = await collection.find(searchQuery).limit(10).toArray();
//         res.json(emails);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send('Error fetching data');
//       }
//     });

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// run().catch(console.dir);

// app.listen(5001, () => console.log('API is working!'));

import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());

const uri = 'mongodb+srv://GraceLTQ:Apple_030711@outboundemailcluster.xapxelz.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const dbName = 'OutboundEmailCluster';
const collectionName = 'emaildata';

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
  const keys = ['subject', 'sender', 'toRecipients'];

  const searchQuery = q ? {
    $or: keys.map(key => ({ [key]: new RegExp(q, 'i') }))
  } : {};

  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const emails = await collection.find(searchQuery).limit(10).toArray();
    res.json(emails);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
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

