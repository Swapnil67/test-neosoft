const express = require("express")
const mongodb = require("mongodb")

const router = express.Router();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://swapniladsul28:FW6OJXrNcN37c7hM@cluster0.4lglg6x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// * MongoDB client connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// * Health check route
router.get('/health', (req, res) => {
  res.send("API is healthy");
})

// * Loading the data API
router.get('/load/data', async (req, res) => {
  try {
    const conn = await client.db('interview')
    const resp = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await resp.json()
    await conn.collection('user_info').insertMany(data)
    return res.status(200).json({ status: true, message: "Data loaded" })
  } catch (err) {
    console.error("Error ", err);
    return res.status(500).json({ status: true, message: "Data loaded" })
  }
})

// * Get Data from mongodb collection
router.get('/get/data',  async (req, res) => {
  try {
    const maxResults = 10;
    let page = req.query.page
    let sort = req.query.sort;

    // * Pagination
    if(!page || page == undefined) {
      page = 0;
    }

    // * sort by userId
    let direction = 'asc'
    if(sort == 1) {
      direction = 'desc'
    }

    const skipDocs = page * maxResults;
    const conn = await client.db('interview')
    const resp = await conn
      .collection("user_info")
      .find({})
      .sort({ userId: direction })
      .skip(skipDocs)
      .limit(maxResults)
      .toArray();

    return res.status(200).json({ status: true, data: resp })
  } catch (err) {
    console.error("Error ", err);
    return res.status(500).json({ status: true, message: "Data loaded" })
  }
})


module.exports = router;