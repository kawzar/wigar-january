const mongodb = require("mongodb");
const moment = require("moment");

async function getTotalVisits() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const analytics = await client.db("gallery").collection("analytics");
  const count = await analytics.countDocuments({ ip: { $nin: [null, ""] } });
  client.close();
  return count;
}

async function logVisitor(ip) {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const analytics = await client.db("gallery").collection("analytics");
  await analytics.insertOne({ ip: ip, date: moment().toDate() });
  client.close();
}

module.exports = {
  logVisitor,
  getTotalVisits,
};
