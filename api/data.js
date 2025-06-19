const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  const collectionName = process.env.COLLECTION_NAME;

  if (!uri || !dbName || !collectionName) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  try {
    const client = await MongoClient.connect(uri, { maxPoolSize: 1 });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const latest = await collection.findOne({}, { sort: { _id: -1 } });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ distance: latest?.data || "No data found" });

    await client.close();
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ error: err.message });
  }
};
