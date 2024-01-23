import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import memjs from 'memjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://Admin:NodesAdvisors2024@dev.jq8me.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'dev';
const InboundCollectionName = 'InboundEmails';

const mc = memjs.Client.create("localhost:11211");

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // do not use SSL
  auth: {
    user: 'shaoyan.li@nodesadvisors.com',
    pass: 'HvpTi4@DL%fAAA7'
  }
});

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

app.post('/login', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('Users');
    const { email, verificationCode } = req.query;

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    mc.get(email, (err, value) => {
      if (err) throw err;

      if (!value || value.toString() !== verificationCode) {
        return res.status(403).send('Invalid verification code');
      }

      // Generate a token for the user
      const token = jwt.sign({ _id: user._id }, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key

      res.json({ token });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.post('/signup', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('Users');
    const { email, verificationCode, username } = req.body;

    const user = await collection.findOne({ email });

    if (user) {
      return res.status(409).send('User already exists');
    }

    const newUser = await collection.insertOne({ email, username });

    mc.get(email, (err, value) => {
      if (err) throw err;

      if (!value || value.toString() !== verificationCode) {
        return res.status(403).send('Invalid verification code');
      }

      const token = jwt.sign({ _id: newUser.insertedId }, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key

      res.json({ token });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } finally {
    await client.close();
  }
});

app.post('/sendVerificationCode', async (req, res) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  mc.set(req.body.email, verificationCode, { expires: 300 }, (err, val) => {
    if (err) throw err;

    // Send the verification code via email
    let mailOptions = {
      from: 'shaoyan.li@nodesadvisors.com', // Replace with your email
      to: req.body.email,
      subject: 'Your verification code @ NodesAdvisors',
      text: 'Your verification code is: ' + verificationCode
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent');
      }
    });
  });
});

app.post('/verifyToken', verifyToken, async (req, res) => {
  res.status(200).send('Valid token');
});

async function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key

    await client.connect();
    const database = client.db('dev');
    const collection = database.collection('Users');
    const user = await collection.findOne({ _id: verified._id });
    await client.close();

    // Check if the email in the request body matches the email of the user
    if (req.body.email !== user.email) {
      return res.status(403).send('Invalid request');
    }

    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

app.listen(5001, async () => {
  console.log('API is working!');
  await connectToMongoDB();
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB disconnected on app termination');
  process.exit(0);
});

