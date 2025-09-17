require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Initializing the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect mongodb
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@learning-cluster.4pttlh7.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middlewares
const logger = (req, res, next) => {
  console.log(req.method, req.hostname, req.originalUrl);
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const carDoctorDatabase = client.db("CarDoctorDB");
    const servicesCollection = carDoctorDatabase.collection('services');
    const ordersCollection = carDoctorDatabase.collection('orders');

    // auth api
    app.post('/login', logger, async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      }).send({ success: true });
    });

    app.post('/logout', async (req, res) => {
      res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    });

    // services api
    app.get('/services', async (req, res) => {
      const allServices = await servicesCollection.find().toArray();
      res.send(allServices);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, img: 1, price: 1, service_id: 1 }
      }
      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    });

    // orders api
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result)
    });

    app.get('/my-orders', logger, verifyToken, async (req, res) => {
      if (req.user.email !== req.query.email) {
        res.status(403).send({ message: "forbidden access" });
      };
      let query = {};
      if (req.query?.email) {
        query = { customerEmail: req.query.email };
      }
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    app.patch('/my-orders/:id', async (req, res) => {
      const id = req.params.id;
      const { serviceStatus } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          serviceStatus: serviceStatus,
        },
      };
      const result = await ordersCollection.updateOne(filter, updatedDoc);
      res.send(result)
    });

    app.delete('/my-orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // connection status
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('car doctor server is running')
})

app.listen(port, () => {
  console.log(`car doctor server is running on port: ${port}`)
})