const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("now server is running perfectly");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a23wjbh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const db = client.db("nolok");
    const serviceCollection = db.collection("services");
    // only 3 service
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    // all services
    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // get specific sevices
    app.get("/Service_Details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const details = await serviceCollection.findOne(query);
      res.send(details);
    });

    // post review
    app.post("/review", async (req, res) => {
      const { body } = req;

      const serviceReview = await db.collection("service_review");
      const result = await serviceReview.insertOne({
        ...body,
      });
      res.send(result);
    });

    app.get("/my_review", async (req, res) => {
      const myEmail = req.query.email;
      const myReviews = await db
        .collection("service_review")
        .find({
          email: myEmail,
        })
        .toArray();
      res.json(myReviews);
    });

    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { serviceId: id };
      const cursor = await db
        .collection("service_review")
        .find(query)
        .toArray();
      res.json(cursor);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("server is runnin on", port);
});
