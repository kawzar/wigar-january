const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

router.get("/rooms", async (req, res) => {
  const rooms = await loadRoomsCollection();
  res.json(await rooms.findOne({}, { _id: 0 }));
});

router.get("/settings", async (req, res) => {
  const settings = await loadConfigCollection();
  res.json(await settings.findOne({}, { _id: 0 }));
});

router.get("/sounds", async (req, res) => {
  const sounds = await loadSoundsCollection();
  res.json(await sounds.findOne({}, { _id: 0 }));
});

router.get("/images", async (req, res) => {
  const images = await loadImagesCollection();
  res.json(await images.findOne({}, { _id: 0 }));
});

async function loadConfigCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("gallery").collection("settings");
}

async function loadRoomsCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("gallery").collection("rooms");
}

async function loadImagesCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("gallery").collection("images");
}

async function loadSoundsCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("gallery").collection("sounds");
}

async function getSettings() {
  const settings = await loadConfigCollection();
  return await settings.findOne({}, { _id: 0 });
}

async function getRooms() {
  const rooms = await loadRoomsCollection();
  return await rooms.findOne({}, { _id: 0 });
}

async function getSounds() {
  const sounds = await loadSoundsCollection();
  return await sounds.findOne({}, { _id: 0 });
}

async function getImages() {
  const images = await loadImagesCollection();
  return await images.findOne({}, { _id: 0 });
}

module.exports = {
  router: router,
  getSettings,
  getRooms,
  getSounds,
  getImages,
};
