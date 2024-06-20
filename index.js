const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vnidizo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const availableCampCollection = client.db("MedCamp").collection("camp");
    const joinCampCollection = client.db("MedCamp").collection("joinCamp");
    const usersCollection = client.db("MedCamp").collection("user");
    const paymentCollection = client.db("MedCamp").collection("payments");
    const feedbacksCollection = client.db("MedCamp").collection("feedbacks");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // middlewares
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    app.get("/camps", async (req, res) => {
      const result = await availableCampCollection.find().toArray();
      res.send(result);
    });

    app.get("/camps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await availableCampCollection.findOne(query);
      res.send(result);
    });

    app.delete("/CampData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await joinCampCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/camps", verifyToken, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await availableCampCollection.insertOne(item);
      res.send(result);
    });

    app.delete("/joinCamp/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await joinCampCollection.deleteOne(query);
        if (result.deletedCount > 0) {
          res.send({ success: true, deletedCount: result.deletedCount });
        } else {
          res.status(404).send({ success: false, message: "Camp not found" });
        }
      } catch (error) {
        console.error("Error deleting camp:", error);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.patch("/camps/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: item.campName,
          fees: item.fees,
          location: item.location,
          dateTime: item.dateTime,
          healthcareProfessional: item.healthcareProfessional,
        },
      };

      const result = await availableCampCollection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
    });

    app.get("/joinCamp/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await joinCampCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    app.get("/joinCamp", async (req, res) => {
      const result = await joinCampCollection.find().toArray();
      res.send(result);
    });

    // Backend route to delete entries based on user email

    app.post("/joinCamp", async (req, res) => {
      const { campName, email } = req.body;
      const existingEntry = await joinCampCollection.findOne({
        campName,
        email,
      });

      if (existingEntry) {
        return res
          .status(400)
          .send({ message: "You have already joined this camp." });
      }

      // Proceed with adding the camp data
      const newEntry = req.body;
      const result = await joinCampCollection.insertOne(newEntry);
      res.status(201).send({ insertedId: result.insertedId });
    });

    app.get("/campParticipantsCount", async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: "$campName",
            count: { $sum: 1 },
          },
        },
      ];

      const result = await joinCampCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    // users

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/userProfile", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await usersCollection.updateOne(filter, updatedDoc);
        res.send(result);
      }
    );

    app.patch("/updateProfile", async (req, res) => {
      const { name, email } = req.body;
      const emailMatch = req.query.email;

      const updatedFields = {
        name: name,
        email: email,
      };

      const updateOperation = {
        $set: updatedFields,
      };
      console.log("Updating profile for email:", emailMatch);
      console.log("New data:", updatedFields);

      const result = await usersCollection.updateOne(
        { email: emailMatch },
        updateOperation
      );

      res.send({ message: "Profile updated successfully", result });
    });

    // payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount, "amount inside the intent");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.get("/payments/:email", verifyToken, async (req, res) => {
      const query = { email: req.params.email };

      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/payments/", verifyToken, verifyAdmin, async (req, res) => {
      const query = req.body;
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/payments/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          status: "Confirmed",
        },
      };

      const result = await paymentCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.post("/payments", verifyToken, async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentCollection.insertOne(payment);

      res.send({ paymentResult });
    });

    // feedback

    app.post("/feedback", async (req, res) => {
      const { campId, email } = req.body;
      const existingFeedback = await feedbacksCollection.findOne({
        campId,
        email,
      });

      if (existingFeedback) {
        return res
          .status(400)
          .send({ message: "Feedback already submitted for this camp." });
      }

      try {
        const feedbackData = await feedbacksCollection.insertOne(req.body);
        res.status(201).send(feedbackData); // Send status 201 for successful creation
      } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).send({ message: "Failed to submit feedback." });
      }
    });

    app.get("/feedback", async (req, res) => {
      const result = await feedbacksCollection.find().toArray();
      res.send(result);
    });

    app.get("/feedback/:email/:id", async (req, res) => {
      const { email, id } = req.params;
      const query = { email, campId };
      const result = await feedbacksCollection.find(query).toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MedCamp is sitting");
});

app.listen(port, () => {
  console.log(`MedCamp is sitting on port ${port}`);
});
