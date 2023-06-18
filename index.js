const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware...........................................
app.use(cors());
app.use(express.json());
// MongoDB user and passwords..........................
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1nqrclq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // MongoDB collections ............................
    const chatCollection = client.db("tea-chat").collection("chatCollection");
    const statusCollection = client
      .db("tea-chat")
      .collection("statusCollection");
    const usersCollection = client.db("tea-chat").collection("usersCollection");

    // user post/create code..........................
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("New user", user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      console.log(existingUser);
      if (existingUser) {
        return res.send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // user get/read code ...........................
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // user get specific by id code...............
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // user update code ..............................
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
          img: user.img,
          description: user.description,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    // user delete code...............................
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // user get specific data by email code .............
    app.get("/users/email/:email", async (req, res) => {
      const result = await usersCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // status post/create code..........................
    app.post("/status", async (req, res) => {
      const status = req.body;
      console.log("New status", status);
      const result = await statusCollection.insertOne(status);
      res.send(result);
    });

    // status get/read code ...........................
    app.get("/status", async (req, res) => {
      const cursor = statusCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // status get specific data by email code .............
    app.get("/status/email/:email", async (req, res) => {
      const result = await statusCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // status delete code...............................
    app.delete("/status/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await statusCollection.deleteOne(query);
      res.send(result);
    });

    // user get specific by id code...............
    app.get("/status/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await statusCollection.findOne(query);
      res.send(result);
    });

    // status update code ..............................
app.put("/status/:id", async (req, res) => {
  const id = req.params.id;
  const updatedStatus = req.body.mystatus; // Use req.body.status to get the updated status value
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedUser = {
    $set: {
      mystatus: updatedStatus, // Use the updated status value directly
    },
  };
  const result = await statusCollection.updateOne(
    filter,
    updatedUser,
    options
  );
  res.send(result);
});


    await client.db("admin").command({ ping: 1 });
    console.log(" mongo Server is  running!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Chat server running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
