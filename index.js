const express = require("express");

const routes = require("./route");

const app = express();

// * Express middlewares
app.use(express.json());

const port = 8001;

app.use("/", routes)

// * Runs the express app
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
