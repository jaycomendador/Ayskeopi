const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

require("dotenv").config();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `CoffeeQUEST API on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.get("/", (req, res) => {
  res.json({
    message: "CoffeeQUEST API is working!"
  });
});