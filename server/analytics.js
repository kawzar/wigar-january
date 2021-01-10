const mongodb = require("mongodb");
const moment = require("moment");

async function getTotalVisits() {
  const analytics = await loadAnalyticsCollection();
  return await analytics.countDocuments({ ip: { $nin: [null, ""] } });
}

async function logVisitor(ip) {
  const analytics = await loadAnalyticsCollection();
  await analytics.insertOne({ ip: ip, date: moment().toDate() });
}

async function loadAnalyticsCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("gallery").collection("analytics");
}

module.exports = {
  logVisitor,
  getTotalVisits,
};
