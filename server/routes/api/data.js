const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

router.get("/rooms", async (req, res) => {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("rooms");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  res.json(result);
});

router.get("/settings", async (req, res) => {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("settings");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  res.json(result);
});

router.get("/sounds", async (req, res) => {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("sounds");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  res.json(result);
});

router.get("/images", async (req, res) => {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("images");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  res.json(result);
});


async function getSettings() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("settings");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  return result;
}

async function getRooms() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("rooms");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  return result;
}

async function getSounds() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("sounds");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  return result;
}

async function getImages() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection =  client.db("gallery").collection("images");
  const result = await collection.findOne({}, { _id: 0 })
  client.close();
  return result
}

module.exports = {
  router: router,
  getSettings,
  getRooms,
  getSounds,
  getImages,
};
